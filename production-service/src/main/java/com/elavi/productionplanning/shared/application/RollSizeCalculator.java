package com.elavi.productionplanning.shared.application;

import org.springframework.stereotype.Service;

@Service
public class RollSizeCalculator {

    public String determineRollSize(String qualityCode, double width) {
        // Based on Roll Size Classification
        switch (qualityCode) {
            case "0700": // Velvet
            case "0701":
                if (width < 1.70) return "S";
                if (width <= 1.97) return "M";
                return "XL";
            case "0705": // Volta
                if (width < 1.70) return "S";
                if (width <= 1.86) return "M";
                return "XL";
            case "0600": // Patio
            case "0610": // Level
            case "0607": // Impact Pro
                if (width < 1.70) return "S";
                if (width <= 1.93) return "M";
                return "XL";
            case "1001": // Prestige Vilt
            case "1002": // Elegance
                if (width < 1.70) return "S";
                if (width <= 1.99) return "M";
                return "XL";
            case "0334": // Country
                if (width < 1.75) return "S";
                if (width <= 1.85) return "M";
                return "XL";
            default:
                return "M"; // Default
        }
    }
}



