package com.elavi.productionplanning.shared.application;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import com.elavi.productionplanning.machine.domain.valueobject.MachineStep;

/**
 * Equivalent of PHP's config/autoload/pp-workflow.global.php
 *
 * Maps quality codes (or product names) to the correct machine sequence.
 * Accepts BOTH quality codes (0600, 0700â€¦) AND lowercase product names.
 *
 * Workflows:
 *   WF1: Colaris(a17) â†’ Coating(a75) â†’ Cutting(a15)          â€” premium, no border
 *   WF2: Colaris(a17) â†’ Cutting(a15)                          â€” standard (default)
 *   WF3: Colaris(a17) â†’ Cutting(a15) â†’ Coating+Cut(a78)       â€” premium, with border
 *   WF4: Colaris(a17) â†’ Cutting(a15) â†’ Sewing(a18)            â€” Viva (sewing needed)
 *   WF5: Colaris(a17) only                                     â€” roll-only products
 *   WF6: EFI(a25)    â†’ Cutting(a15)                           â€” EFI digital print
 */
@Component
public class WorkflowConfig {

    // Quality codes that need SEWING (Viva)
    private static final Set<String> VIVA_CODES = Set.of("0499", "0500", "viva");

    // Quality codes that go through COATING (premium, no border)
    private static final Set<String> COATING_NO_BORDER = Set.of(
        "0411", "0334", "0600", "0607", "0610", "1001", "1002",
        "jewel", "globossoft", "country", "patio", "level", "impact pro",
        "prestige vilt", "elegance rubbermix", "elegance"
    );

    // Quality codes with COATING+INLINE CUTTING (premium, with border)
    private static final Set<String> COATING_WITH_BORDER = Set.of(
        "0411", "0334", "0600", "0607", "0610", "1001", "1002",
        "jewel", "globossoft", "country", "patio", "level", "impact pro",
        "prestige vilt", "elegance rubbermix", "elegance",
        "velvet", "volta", "melody", "pearl"
    );

    // EFI products (digital print)
    private static final Set<String> EFI_PRODUCTS = Set.of(
        "bolt", "beau", "mika", "picnic", "joy"
    );

    public List<MachineStep> buildSteps(String quality, String border) {
        String q = (quality != null) ? quality.trim().toLowerCase() : "";
        boolean hasBorder = border != null
                && !border.equalsIgnoreCase("None")
                && !border.trim().isEmpty();

        // WF6: EFI digital print
        if (EFI_PRODUCTS.contains(q)) {
            return steps(
                step("a25", "EFI-printer",            "form", 1),
                step("a15", "Cutting",                 "job",  2)
            );
        }

        // WF4: Viva â€” needs sewing
        if (VIVA_CODES.contains(q)) {
            return steps(
                step("a17", "Colaris",  "form", 1),
                step("a15", "Cutting",  "job",  2),
                step("a18", "Sewing",   "job",  3)
            );
        }

        // WF3: Premium WITH border â†’ inline coating+cutting as finish
        if (hasBorder && COATING_WITH_BORDER.contains(q)) {
            return steps(
                step("a17", "Colaris",               "form", 1),
                step("a15", "Cutting",                "job",  2),
                step("a78", "Coating+in-line Cutting","job",  3)
            );
        }

        // WF1: Premium WITHOUT border â†’ separate coating then cutting
        if (!hasBorder && COATING_NO_BORDER.contains(q)) {
            return steps(
                step("a17", "Colaris",  "form", 1),
                step("a75", "Coating",  "form", 2),
                step("a15", "Cutting",  "job",  3)
            );
        }

        // WF2: Standard / Default (Pearl, Melody, Velvet, Volta, unknown codes)
        return steps(
            step("a17", "Colaris",  "form", 1),
            step("a15", "Cutting",  "job",  2)
        );
    }

    // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    private MachineStep step(String machineId, String machineName, String type, int priority) {
        return MachineStep.builder()
                .machineId(machineId)
                .machineName(machineName)
                .type(type)
                .priority(priority)
                .status("WAITING_FOR_MANUFACTURING")
                .build();
    }

    @SafeVarargs
    private List<MachineStep> steps(MachineStep... items) {
        return new ArrayList<>(List.of(items));
    }
}



