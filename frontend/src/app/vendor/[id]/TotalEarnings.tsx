import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TotalEarningsProps {
  amount: number
}

export default function TotalEarnings({ amount }: TotalEarningsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">${amount.toLocaleString()}</p>
      </CardContent>
    </Card>
  )
}


