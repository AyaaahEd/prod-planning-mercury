package com.elavi.productionplanning.rollsout.service;

import com.elavi.productionplanning.job.repository.readmodel.JobView;
import com.elavi.productionplanning.job.repository.readmodel.JobViewRepository;
import com.elavi.productionplanning.rollsout.domain.event.RollsOutEvents.RollsOutCreatedEvent;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RollsOutPdfGenerator {

    private final JobViewRepository jobViewRepository;

    @EventListener
    public void handleRollsOutCreated(RollsOutCreatedEvent event) {
        log.info("Generating PDF for new RollsOut: {}", event.getRollsOutId());
        try {
            // 1. Create directory if not exists
            Path pdfDir = Paths.get("rollout-pdfs");
            if (!Files.exists(pdfDir)) {
                Files.createDirectories(pdfDir);
            }

            // 2. Output file path
            File pdfFile = new File(pdfDir.toFile(), "Rollout_" + event.getRollsOutId() + ".pdf");

            // 3. Init Document
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
            document.open();

            // 4. Add Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Paragraph title = new Paragraph("Rollout Summary: " + event.getRollsOutId(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // 5. Generate and Add QR Code
            String qrContent = "ROLLOUT_ID:" + event.getRollsOutId() + "|QUALITY:" + event.getQuality() + "|REPS:" + event.getRepetitions();
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 150, 150);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();
            Image qrImage = Image.getInstance(pngData);
            qrImage.setAlignment(Element.ALIGN_CENTER);
            qrImage.setSpacingAfter(20);
            document.add(qrImage);

            // 6. Add Details
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Quality: " + event.getQuality(), normalFont));
            document.add(new Paragraph("Repetitions: " + event.getRepetitions(), normalFont));
            document.add(new Paragraph("Target Machines: " + (event.getMachineIds() != null ? String.join(", ", event.getMachineIds()) : "None"), normalFont));
            document.add(new Paragraph("Included FormVersions: " + (event.getFormVersionIds() != null ? String.join(", ", event.getFormVersionIds()) : "None"), normalFont));
            document.add(new Paragraph(" "));

            // 7. Add Completed Jobs
            document.add(new Paragraph("Associated Completed Jobs (Status: DONE):", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph(" "));

            if (event.getFormVersionIds() != null && !event.getFormVersionIds().isEmpty()) {
                List<JobView> completedJobs = jobViewRepository.findByFormVersionIdInAndStatus(event.getFormVersionIds(), "DONE");
                if (completedJobs.isEmpty()) {
                    document.add(new Paragraph("No completed jobs found for these FormVersions.", normalFont));
                } else {
                    com.lowagie.text.List jobList = new com.lowagie.text.List(com.lowagie.text.List.UNORDERED);
                    for (JobView job : completedJobs) {
                        jobList.add(new ListItem("Job ID: " + job.getJobId() + " (FormVersion: " + job.getFormVersionId() + ")", normalFont));
                    }
                    document.add(jobList);
                }
            } else {
                document.add(new Paragraph("No FormVersions attached.", normalFont));
            }

            document.close();
            log.info("PDF Generated successfully at: {}", pdfFile.getAbsolutePath());

        } catch (Exception e) {
            log.error("Failed to generate PDF for RollsOut {}", event.getRollsOutId(), e);
        }
    }
}
