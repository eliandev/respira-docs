// Encabezado de paso (título + subtítulo). Mismo markup en los pasos deudas,
// resultado y aliado.
export default function StepHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
      <p className="text-muted">{subtitle}</p>
    </header>
  );
}
