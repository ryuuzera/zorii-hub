import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function MonitorCard({ title, description, cardContent, className, contentClass, headerClass }: any) {
  return (
    <Card className={className}>
      <CardHeader className={headerClass}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={contentClass}>{cardContent}</CardContent>
      {/* <CardFooter>
      <p>Card Footer</p>
    </CardFooter> */}
    </Card>
  );
}
