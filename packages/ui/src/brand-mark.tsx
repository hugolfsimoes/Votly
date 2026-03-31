type BrandMarkProps = {
  className?: string;
};

/** Usa utilitários Tailwind (`text-votly-accent`) — o host da app deve incluir o tema Votly. */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span className={className}>
      VOT<span className="text-votly-accent">LY</span>
    </span>
  );
}
