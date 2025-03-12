import { createComponent, Footer } from "@/main";

export const PageFooter = createComponent<{ site_name: string }>((attribute) => 
    Footer({ class: "page-footer" }, `&copy; 2025 ${attribute.site_name}`));
