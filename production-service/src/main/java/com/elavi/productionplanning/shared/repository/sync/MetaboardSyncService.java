package com.elavi.productionplanning.shared.repository.sync;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import com.elavi.productionplanning.form.domain.Form;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;
import com.elavi.productionplanning.orderitem.domain.OrderItem;
import com.elavi.productionplanning.shared.AggregateStore;
import com.elavi.productionplanning.shared.application.WorkflowConfig;
import com.elavi.productionplanning.shared.domain.service.WorkingHoursService;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetaboardSyncService {

    private final AggregateStore aggregateStore;
    private final WorkflowConfig workflowConfig;
    private final com.elavi.productionplanning.shared.domain.service.WorkingHoursService workingHoursService;

    @Value("${metaboard.ftp.inbound-path}")
    private String inboundPath;

    @Value("${metaboard.ftp.processed-path}")
    private String processedPath;

    @Scheduled(fixedDelay = 10000) // Runs every 10 seconds
    public void syncFromMetaboard() {
        File inboundFolder = new File(inboundPath);
        if (!inboundFolder.exists()) {
            boolean created = inboundFolder.mkdirs();
            if (created) log.info("Created inbound folder: {}", inboundPath);
            return;
        }

        File[] zipFiles = inboundFolder.listFiles((dir, name) -> name.toLowerCase().endsWith(".zip"));
        if (zipFiles == null || zipFiles.length == 0) {
            return;
        }

        log.info("Found {} ZIP file(s) in Metaboard inbound directory.", zipFiles.length);

        for (File zipFile : zipFiles) {
            processZipFile(zipFile);
        }
    }

    private void processZipFile(File zipFile) {
        log.info("Processing Metaboard layout ZIP: {}", zipFile.getName());
        File tempDir = null;
        try {
            // 1. Create a unique temporary directory for extraction
            tempDir = new File(System.getProperty("java.io.tmpdir"), "metaboard_" + UUID.randomUUID());
            if (!tempDir.mkdirs()) {
                throw new RuntimeException("Could not create temporary directory: " + tempDir.getAbsolutePath());
            }

            // 2. Extract ZIP
            unzip(zipFile, tempDir);

            // 3. Find and parse XML file
            File xmlFile = findXmlFile(tempDir);
            if (xmlFile == null) {
                log.error("No XML layout file found in ZIP {}", zipFile.getName());
                moveFileToProcessed(zipFile, false);
                return;
            }

            parseAndImportLayout(xmlFile, zipFile.getName());

            // 4. Move ZIP to processed
            moveFileToProcessed(zipFile, true);
            log.info("Successfully processed ZIP file: {}", zipFile.getName());

        } catch (Exception e) {
            log.error("Failed to process ZIP file: {}", zipFile.getName(), e);
            moveFileToProcessed(zipFile, false);
        } finally {
            // Clean up temporary files
            if (tempDir != null && tempDir.exists()) {
                deleteDir(tempDir);
            }
        }
    }

    private void parseAndImportLayout(File xmlFile, String zipName) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(xmlFile);
        doc.getDocumentElement().normalize();

        // Parse Form Details
        Element layoutElement = (Element) doc.getElementsByTagName("Layout").item(0);
        if (layoutElement == null) {
            throw new IllegalArgumentException("Invalid layout XML: missing <Layout> element.");
        }

        String cutSheetSize = layoutElement.getAttribute("CutSheetSize");
        double formWidth = 0;
        double formHeight = 0;
        if (cutSheetSize != null && !cutSheetSize.isEmpty()) {
            String[] parts = cutSheetSize.split("\\s+");
            if (parts.length >= 2) {
                formWidth = Double.parseDouble(parts[0]) / 100.0;  // Convert to meters
                formHeight = Double.parseDouble(parts[1]) / 100.0; // Convert to meters
            }
        }

        // Generate form number from ZIP name or default
        String formNumber = zipName.replace(".zip", "");
        boolean isReprint = false;

        // Collect Placed Objects (Order Items)
        NodeList placedObjects = doc.getElementsByTagName("PlacedObject");
        log.info("XML Layout {} has dimensions {}m x {}m, containing {} placed objects.", 
                formNumber, formWidth, formHeight, placedObjects.getLength());

        // We check if any of the items is a reprint to mark the Form as a reprint
        for (int i = 0; i < placedObjects.getLength(); i++) {
            Element objElement = (Element) placedObjects.item(i);
            String compName = objElement.getAttribute("ComponentName");
            if (compName != null && compName.contains("_R")) {
                isReprint = true;
                break;
            }
        }

        // Extract quality from XML (optional attribute) Ã¢â‚¬â€ fallback to "0600" (Patio/Standard)
        String quality = layoutElement.getAttribute("Quality");
        if (quality == null || quality.isBlank()) {
            quality = layoutElement.getAttribute("Grade"); // Often stored as Grade in Metaboard
        }
        if (quality == null || quality.isBlank()) {
            quality = guessQualityFromFormNumber(formNumber);
        }
        String border = layoutElement.getAttribute("Border");
        if (border == null || border.isBlank()) {
            border = "None";
        }

        List<MachineStep> steps = workflowConfig.buildSteps(quality, border);

        // Create the Form aggregate
        Form form = Form.create(formNumber, formWidth, formHeight, quality, 1, isReprint, steps);

        // Process placed items
        for (int i = 0; i < placedObjects.getLength(); i++) {
            Element objElement = (Element) placedObjects.item(i);
            String rawId = objElement.getAttribute("ComponentName");
            double width = Double.parseDouble(objElement.getAttribute("Width")) / 100.0;
            double height = Double.parseDouble(objElement.getAttribute("Height")) / 100.0;

            // Check reprint suffix, e.g. "IKO_998811_R1"
            String orderItemId = rawId;
            boolean reprintItem = false;
            String suffix = "";
            if (rawId.contains("_R")) {
                reprintItem = true;
                int idx = rawId.indexOf("_R");
                orderItemId = rawId.substring(0, idx); // Strip reprint suffix
                suffix = rawId.substring(idx);
            }

            // Load or create OrderItem
            OrderItem orderItem = aggregateStore.load(orderItemId, OrderItem.class);
            if (orderItem == null) {
                // Determine per-item quality if provided, else use form-level quality
                String itemQuality = objElement.getAttribute("Quality");
                if (itemQuality == null || itemQuality.isBlank()) {
                    itemQuality = quality;
                }
                String itemBorder = objElement.getAttribute("Border");
                if (itemBorder == null || itemBorder.isBlank()) {
                    itemBorder = border;
                }
                List<MachineStep> itemSteps = workflowConfig.buildSteps(itemQuality, itemBorder);

                String sourceSystem = determineSourceSystem(orderItemId);
                orderItem = OrderItem.create(orderItemId, width, height, sourceSystem, itemQuality, itemBorder, itemSteps);

                // Calculate accurate promise date starting from today
                orderItem.calculatePromiseAvailableDate(Instant.now(), workingHoursService);

                aggregateStore.save(orderItem);
                log.info("Created OrderItem {} (quality={}, border={})", orderItemId, itemQuality, itemBorder);
            }

            // If it's a reprint, update original item reprint state
            if (reprintItem) {
                log.info("Reprint detected for OrderItem {}. Suffix: {}", orderItemId, suffix);
                orderItem.updateReprintState("PROCESSED");
                aggregateStore.save(orderItem);
            }

            // Parse coordinate positions from CTM and attach for EACH placement
            NodeList placementElements = objElement.getElementsByTagName("Placement");
            for (int j = 0; j < placementElements.getLength(); j++) {
                Element placementElement = (Element) placementElements.item(j);
                double x = 0;
                double y = 0;
                String ctm = placementElement.getAttribute("CTM");
                if (ctm != null && !ctm.isEmpty()) {
                    String[] ctmParts = ctm.split("\\s+");
                    if (ctmParts.length >= 2) {
                        x = Double.parseDouble(ctmParts[ctmParts.length - 2]);
                        y = Double.parseDouble(ctmParts[ctmParts.length - 1]);
                    }
                }
                form.attachOrderItem(orderItemId, width, height, x, y);
            }
        }

        // Save Form aggregate to Event Store
        aggregateStore.save(form);
        log.info("Successfully created and saved Form {} with items", formNumber);
    }

    private void unzip(File zipFile, File destDir) throws Exception {
        try (ZipInputStream zipIn = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry = zipIn.getNextEntry();
            while (entry != null) {
                File filePath = new File(destDir, entry.getName());
                if (!entry.isDirectory()) {
                    // Create parent directories if missing
                    filePath.getParentFile().mkdirs();
                    try (FileOutputStream fos = new FileOutputStream(filePath)) {
                        byte[] bytes = new byte[4096];
                        int read;
                        while ((read = zipIn.read(bytes)) != -1) {
                            fos.write(bytes, 0, read);
                        }
                    }
                } else {
                    filePath.mkdirs();
                }
                zipIn.closeEntry();
                entry = zipIn.getNextEntry();
            }
        }
    }

    private File findXmlFile(File dir) {
        File[] xmlFiles = dir.listFiles((d, name) -> name.toLowerCase().endsWith(".xml"));
        if (xmlFiles != null && xmlFiles.length > 0) {
            return xmlFiles[0];
        }
        // Check subdirectories
        File[] subdirs = dir.listFiles(File::isDirectory);
        if (subdirs != null) {
            for (File subdir : subdirs) {
                File found = findXmlFile(subdir);
                if (found != null) return found;
            }
        }
        return null;
    }

    private void moveFileToProcessed(File file, boolean success) {
        File processedDir = new File(processedPath, success ? "success" : "failed");
        if (!processedDir.exists()) {
            processedDir.mkdirs();
        }
        File destFile = new File(processedDir, file.getName());
        try {
            Files.move(file.toPath(), destFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            log.info("Moved file {} to {}", file.getName(), destFile.getAbsolutePath());
        } catch (Exception e) {
            log.error("Failed to move file {} to processed folder", file.getName(), e);
        }
    }

    private void deleteDir(File file) {
        File[] contents = file.listFiles();
        if (contents != null) {
            for (File f : contents) {
                deleteDir(f);
            }
        }
        file.delete();
    }

    private String determineSourceSystem(String orderItemId) {
        if (orderItemId.startsWith("IPO_")) return "INTEX_PRODUCTION";
        if (orderItemId.startsWith("IKO_")) return "INTEX_CUSTOMER";
        if (orderItemId.startsWith("PCC_")) return "PRINTCLOUD";
        if (orderItemId.startsWith("PYM_")) return "PYM";
        if (orderItemId.startsWith("DAM_")) return "DAM";
        if (orderItemId.startsWith("MAN_")) return "MANUAL";
        return "UNKNOWN";
    }

    /**
     * When no Quality attribute is in the XML, we make a best-effort guess.
     * In production, the quality is fetched from INTEX or Order Service API.
     * For mock/dev purposes, we use a sensible default.
     */
    private String guessQualityFromFormNumber(String formNumber) {
        // Could be extended with lookup logic; default is Patio (0600) Ã¢â‚¬â€ standard workflow
        return "0600";
    }
}



