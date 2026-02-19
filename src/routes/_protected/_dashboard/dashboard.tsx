import { createFileRoute } from '@tanstack/react-router'
import { CartesianGrid, BarChart, Bar, Pie, XAxis, PieChart } from 'recharts'
import {
  IconUsers,
  IconBuilding,
  IconCalendar,
  IconTrendingUp,
} from '@tabler/icons-react'

import { useGetCurrentUserQuery, useGetSessionQuery } from '@/hooks/api/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend,
  ChartConfig,
} from '@/components/ui/chart'

export const Route = createFileRoute('/_protected/_dashboard/dashboard')({
  component: DashboardPage,
})

const departmentData = [
  { name: 'engineering', employees: 45, budget: 4500000 },
  { name: 'product', employees: 12, budget: 1200000 },
  { name: 'design', employees: 8, budget: 800000 },
  { name: 'marketing', employees: 15, budget: 1500000 },
  { name: 'sales', employees: 25, budget: 2500000 },
  { name: 'hr', employees: 6, budget: 600000 },
]

const leaveData = [
  { name: 'vacation', value: 35, fill: 'var(--chart-1)' },
  { name: 'sickleave', value: 15, fill: 'var(--chart-2)' },
  { name: 'personal', value: 8, fill: 'var(--chart-3)' },
  { name: 'bereavement', value: 2, fill: 'var(--chart-4)' },
]

const recentEmployees = [
  {
    id: 'EMP-001',
    name: 'John Davidson',
    role: 'Senior Engineer',
    department: 'Engineering',
    status: 'Active',
    startDate: '2022-03-15',
  },
  {
    id: 'EMP-002',
    name: 'Sarah Chen',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
    startDate: '2021-08-22',
  },
  {
    id: 'EMP-003',
    name: 'Mike Ross',
    role: 'Designer',
    department: 'Design',
    status: 'On Leave',
    startDate: '2023-01-10',
  },
  {
    id: 'EMP-004',
    name: 'Emily Davis',
    role: 'HR Specialist',
    department: 'HR',
    status: 'Active',
    startDate: '2020-11-05',
  },
  {
    id: 'EMP-005',
    name: 'Alex Johnson',
    role: 'Sales Lead',
    department: 'Sales',
    status: 'Active',
    startDate: '2023-06-15',
  },
]

const barChartConfig = {
  employees: {
    label: 'Employees',
    color: 'var(--chart-1)',
  },
  budget: {
    label: 'Budget ($)',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

const pieChartConfig = {
  vacation: {
    label: 'Vacation',
    color: 'var(--chart-1)',
  },
  sickleave: {
    label: 'Sick Leave',
    color: 'var(--chart-2)',
  },
  personal: {
    label: 'Personal',
    color: 'var(--chart-3)',
  },
  bereavement: {
    label: 'Bereavement',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig

function DashboardPage() {
  const currentUserQuery = useGetCurrentUserQuery()
  const sessionQuery = useGetSessionQuery()

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your organization.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <IconUsers className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">111</div>
            <p className="text-muted-foreground text-xs">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <IconBuilding className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-muted-foreground text-xs">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <IconCalendar className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-muted-foreground text-xs">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Retention Rate
            </CardTitle>
            <IconTrendingUp className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-muted-foreground text-xs">
              +2% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Query Data Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Data</CardTitle>
            <CardDescription>
              Current authentication session information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted text-muted-foreground max-h-100 w-full overflow-x-auto rounded-lg p-4 text-xs">
              {JSON.stringify(sessionQuery.data, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
            <CardDescription>Authenticated user details</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted text-muted-foreground max-h-100 w-full overflow-x-auto rounded-lg p-4 text-xs">
              {JSON.stringify(currentUserQuery.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Employees by Department</CardTitle>
            <CardDescription>
              Distribution of employees and budget across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="min-h-[300px]">
              <BarChart accessibilityLayer data={departmentData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    value.charAt(0).toUpperCase() + value.slice(1, 3)
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar
                  dataKey="employees"
                  fill="var(--color-employees)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="budget"
                  fill="var(--color-budget)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Distribution</CardTitle>
            <CardDescription>
              Breakdown of leave types this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieChartConfig} className="min-h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={leaveData}
                  // cx="50%"
                  // cy="50%"
                  // innerRadius={60}
                  // outerRadius={100}
                  // paddingAngle={5}
                  dataKey="value"
                />
                {/* {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))} */}
                {/* </Pie> */}
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  // className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Employees</CardTitle>
          <CardDescription>A list of recently added employees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Employee records from the past month</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="font-mono text-xs">{emp.id}</TableCell>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.role}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{emp.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        emp.status === 'Active' ? 'default' : 'secondary'
                      }
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {emp.startDate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
