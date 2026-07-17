import { cn } from "@/lib/ui";

// Enlace externo con las precauciones de seguridad (noopener) y la flecha ↗.
// Usado para los recursos de ayuda (SSF) en el footer y en el paso de aliado.
export default function ExternalLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-brand-700 underline underline-offset-4 hover:text-brand-800",
        className,
      )}
    >
      {label} <span aria-hidden>↗</span>
    </a>
  );
}
