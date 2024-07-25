import { getCurrentOrg } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getBilling } from '@/http/get-billing';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export async function Billing() {
  const currentOrg = getCurrentOrg()!;
  const { billing } = await getBilling(currentOrg);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Information about your organization costs.</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cost type</TableHead>
              <TableHead className="text-right" style={{ width: 120 }}>
                Quantity
              </TableHead>
              <TableHead className="text-right" style={{ width: 120 }}>
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Projects</TableCell>
              <TableCell className="text-right">{billing.projects.amount}</TableCell>
              <TableCell className="text-right">
                <p>{formatCurrency(billing.projects.total)}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {formatCurrency(billing.projects.unit)} each
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Seats</TableCell>
              <TableCell className="text-right">{billing.seats.amount}</TableCell>
              <TableCell className="text-right">
                <p>{formatCurrency(billing.seats.total)}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {formatCurrency(billing.seats.unit)} each
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell className="text-right">Total</TableCell>
              <TableCell className="text-right font-bold">
                {formatCurrency(billing.total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
