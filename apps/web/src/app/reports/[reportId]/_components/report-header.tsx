import { Badge } from "@/components/badge/badge";

interface ReportHeaderProps {
  title: string;
  description: string;
  category: string;
  subcategory: string;
}

function ReportHeader({
  title,
  description,
  category,
  subcategory,
}: ReportHeaderProps) {
  return (
    <section>
      <div className="flex gap-2 mb-3">
        <Badge variant="default">{category}</Badge>
        <Badge variant="secondary">{subcategory}</Badge>
      </div>
      <h2 className="text-2xl font-semibold leading-tight mb-4">{title}</h2>
      <p className="text-zinc-600 leading-relaxed text-[15px]">{description}</p>
    </section>
  );
}

export default ReportHeader;
