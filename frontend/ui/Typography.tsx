export function H1({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
}

export function H2({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function H3({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function H4({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}

export function P({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function Blockquote({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}

export function List({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
}

export function InlineCode({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  );
}

export function LeadingText({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}

export function LargeText({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="text-lg font-semibold">{children}</div>;
}

export function SmallText({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <small className="text-sm font-medium leading-none">{children}</small>;
}

export function MutedText({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
