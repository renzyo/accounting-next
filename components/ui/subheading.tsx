interface HeadingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const Subheading: React.FC<HeadingProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div>{icon}</div>
      <div className="flex flex-col">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
