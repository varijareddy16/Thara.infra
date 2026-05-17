import logoSrc from "@/assets/thara-logo.png";

type Props = { className?: string; tone?: "dark" | "light" };

export function Logo({ className = "", tone = "dark" }: Props) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={typeof logoSrc === "string" ? logoSrc : logoSrc.src}
        alt="Thara Infra"
        className={`h-12 w-auto object-contain ${tone === "light" ? "brightness-0 invert" : ""}`}
      />
    </div>
  );
}
