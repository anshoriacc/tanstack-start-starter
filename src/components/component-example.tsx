import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  IconAlertCircle,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconClock,
  IconCopy,
  IconCreditCard,
  IconDeviceDesktop,
  IconDotsVertical,
  IconFileText,
  IconFilter,
  IconFolder,
  IconHome,
  IconMail,
  IconMapPin,
  IconMoon,
  IconPlus,
  IconSearch,
  IconSun,
  IconTrash,
  IconUser,
  IconUsers,
} from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { type TTheme, useSetTheme, useTheme } from '@/stores/theme'
import { useGetSessionQuery, useGetCurrentUserQuery } from '@/hooks/api/auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { CommandPaletteButton } from '@/components/command-palette'
import { ButtonGroup } from '@/components/ui/button-group'
import { DatePicker } from '@/components/ui/date-picker'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MotionItem } from './ui/motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const UserProfileExample = () => {
  const { data: session } = useGetSessionQuery()
  const { data: userResponse, isLoading } = useGetCurrentUserQuery()

  if (!session) {
    return (
      <ExampleCard title="User Profile">
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm">Not logged in</p>
          <Link to="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </ExampleCard>
    )
  }

  if (isLoading) {
    return (
      <ExampleCard title="User Profile">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </ExampleCard>
    )
  }

  const user = userResponse as unknown as
    | {
        id: number
        firstName: string
        lastName: string
        email: string
        image: string
      }
    | undefined

  return (
    <ExampleCard title="User Profile">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={user?.image} />
            <AvatarFallback>
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>
        <Separator />
        <Link to="/dashboard">
          <Button className="w-full">
            <IconHome className="mr-2 size-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </ExampleCard>
  )
}

const ThemeToggleExample = () => {
  const theme = useTheme()
  const setTheme = useSetTheme()

  return (
    <ExampleCard title="Radio Group">
      <RadioGroup
        value={theme}
        onValueChange={(value) => setTheme(value as TTheme)}
        className="grid grid-cols-3 gap-2"
      >
        <div>
          <RadioGroupItem
            value="light"
            id="theme-light"
            className="peer sr-only"
          />
          <label
            htmlFor="theme-light"
            className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-aria-checked:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-3 transition-colors"
          >
            <IconSun className="mb-2 size-5" />
            <span className="text-xs font-medium">Light</span>
          </label>
        </div>
        <div>
          <RadioGroupItem
            value="dark"
            id="theme-dark"
            className="peer sr-only"
          />
          <label
            htmlFor="theme-dark"
            className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-aria-checked:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-3 transition-colors"
          >
            <IconMoon className="mb-2 size-5" />
            <span className="text-xs font-medium">Dark</span>
          </label>
        </div>
        <div>
          <RadioGroupItem
            value="system"
            id="theme-system"
            className="peer sr-only"
          />
          <label
            htmlFor="theme-system"
            className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-aria-checked:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-3 transition-colors"
          >
            <IconDeviceDesktop className="mb-2 size-5" />
            <span className="text-xs font-medium">System</span>
          </label>
        </div>
      </RadioGroup>
    </ExampleCard>
  )
}

export const ComponentExample = () => {
  return (
    <MotionItem className="columns-1 gap-6 space-y-6 p-6 md:columns-2 lg:columns-3">
      <UserProfileExample />
      <ThemeToggleExample />
      <BreadcrumbExample />
      <AlertExample />
      <CardExample />
      <TabsExample />
      <FormExample />
      <TableExample />
      <DialogSheetExample />
      <AccordionExample />
      <CommandExample />
      <EmptyStateExample />
      <ToggleTooltipExample />
      <PaginationExample />
    </MotionItem>
  )
}

const BreadcrumbExample = () => {
  return (
    <ExampleCard title="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              <IconHome className="size-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">HR Portal</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Employees</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Hire</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </ExampleCard>
  )
}

const AlertExample = () => {
  return (
    <ExampleCard title="Alert">
      <div className="space-y-4">
        <Alert>
          <IconClock className="size-4" />
          <AlertTitle>Performance Reviews Due</AlertTitle>
          <AlertDescription>
            Q4 performance reviews must be completed by December 31st. 12
            employees pending.
          </AlertDescription>
          <AlertAction>
            <Button size="xs">Review Now</Button>
          </AlertAction>
        </Alert>

        <Alert variant="destructive">
          <IconAlertCircle className="size-4" />
          <AlertTitle>Leave Request Conflict</AlertTitle>
          <AlertDescription>
            Multiple team members requested time off during the same period.
          </AlertDescription>
        </Alert>
      </div>
    </ExampleCard>
  )
}

const CardExample = () => {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <ExampleCard title="Card">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar size="lg">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>John Davidson</CardTitle>
              <CardDescription>Senior Software Engineer</CardDescription>
              <div className="mt-2 flex gap-2">
                <Badge variant="secondary">Engineering</Badge>
                <Badge variant="outline">Full-time</Badge>
              </div>
            </div>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm">
                    <IconDotsVertical className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => toast.success('Profile opened')}
                  >
                    <IconUser className="size-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success('Edit mode')}>
                    <IconFileText className="size-4" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toast.success('Documents opened')}
                  >
                    <IconFolder className="size-4" />
                    Documents
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => toast.error('Employee removed')}
                  >
                    <IconTrash className="size-4" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Employee ID</p>
              <p className="font-medium">EMP-2024-001</p>
            </div>
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">March 15, 2022</p>
            </div>
            <div>
              <p className="text-muted-foreground">Manager</p>
              <p className="font-medium">Sarah Chen</p>
            </div>
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">San Francisco, CA</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            <IconMail className="size-4" />
            Message
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button size="sm">
                  <IconPlus className="size-4" />
                  Assign Task
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <IconBriefcase className="text-primary size-8" />
                </AlertDialogMedia>
                <AlertDialogTitle>Assign New Task</AlertDialogTitle>
                <AlertDialogDescription>
                  This will assign a new onboarding task to John Davidson. They
                  will be notified via email.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => toast.success('Task assigned successfully')}
                >
                  Assign Task
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </ExampleCard>
  )
}

const TabsExample = () => {
  return (
    <ExampleCard title="Tabs">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Contact Information</h4>
            <div className="text-muted-foreground space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <IconMail className="size-4" />
                john.davidson@company.com
              </div>
              <div className="flex items-center gap-2">
                <IconMapPin className="size-4" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-2">
                <IconBuilding className="size-4" />
                Engineering Department
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Team Members</h4>
            <AvatarGroup>
              <Avatar size="sm">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+5</AvatarGroupCount>
            </AvatarGroup>
          </div>
        </TabsContent>
        <TabsContent value="documents">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <IconFileText className="text-muted-foreground size-5" />
                <div>
                  <p className="text-sm font-medium">Contract_2024.pdf</p>
                  <p className="text-muted-foreground text-xs">
                    Uploaded 2 days ago
                  </p>
                </div>
              </div>
              <Badge variant="outline">Signed</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-3">
                <IconFileText className="text-muted-foreground size-5" />
                <div>
                  <p className="text-sm font-medium">ID_Verification.jpg</p>
                  <p className="text-muted-foreground text-xs">
                    Uploaded 1 week ago
                  </p>
                </div>
              </div>
              <Badge>Verified</Badge>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <div className="space-y-3">
            <div className="flex gap-3 text-sm">
              <div className="bg-primary mt-1 h-2 w-2 rounded-full" />
              <div>
                <p className="font-medium">Performance review completed</p>
                <p className="text-muted-foreground text-xs">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="bg-primary mt-1 h-2 w-2 rounded-full" />
              <div>
                <p className="font-medium">Updated personal information</p>
                <p className="text-muted-foreground text-xs">Yesterday</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="bg-muted mt-1 h-2 w-2 rounded-full" />
              <div>
                <p className="font-medium">Leave request approved</p>
                <p className="text-muted-foreground text-xs">3 days ago</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ExampleCard>
  )
}

const departments = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Design', value: 'design' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
  { label: 'HR', value: 'hr' },
] as const

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
] as const

const FormExample = () => {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [agreed, setAgreed] = React.useState(false)

  return (
    <ExampleCard title="Form">
      <Card>
        <CardHeader>
          <CardTitle>Add New Employee</CardTitle>
          <CardDescription>
            Enter the details for the new employee below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              toast.success('Employee added successfully!')
            }}
          >
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input id="lastName" placeholder="Enter last name" required />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Work Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="department">Department</FieldLabel>
                <Select defaultValue={null}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="employmentType">
                  Employment Type
                </FieldLabel>
                <Combobox items={employmentTypes}>
                  <ComboboxInput
                    id="employmentType"
                    placeholder="Select employment type"
                    required
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No employment types found</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>

              <Field>
                <FieldLabel htmlFor="salary">Salary</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="salary"
                    placeholder="Enter annual salary"
                  />
                  <InputGroupAddon>
                    <InputGroupText>USD</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="website">Website</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <IconSearch className="text-muted-foreground size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="website"
                    type="url"
                    placeholder="company.com"
                  />
                  <InputGroupButton
                    type="button"
                    onClick={() => toast.success('Opening website')}
                  >
                    <IconSearch className="size-4" />
                  </InputGroupButton>
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="notes">Additional Notes</FieldLabel>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information about the employee..."
                  rows={3}
                />
              </Field>

              <Field orientation="horizontal">
                <Checkbox
                  id="agreement"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                />
                <FieldLabel htmlFor="agreement">
                  I confirm all information is accurate
                </FieldLabel>
              </Field>

              <Field orientation="horizontal">
                <Label className="flex items-center gap-2 text-sm font-normal">
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                  Send welcome email
                </Label>
              </Field>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={!agreed}>
                  Add Employee
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </ExampleCard>
  )
}

const employees = [
  {
    id: 'EMP-001',
    name: 'John Davidson',
    role: 'Senior Engineer',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: 'EMP-002',
    name: 'Sarah Chen',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
  },
  {
    id: 'EMP-003',
    name: 'Mike Ross',
    role: 'Designer',
    department: 'Design',
    status: 'On Leave',
  },
  {
    id: 'EMP-004',
    name: 'Emily Davis',
    role: 'HR Specialist',
    department: 'HR',
    status: 'Active',
  },
]

const TableExample = () => {
  const [currentPage, setCurrentPage] = React.useState(1)

  return (
    <ExampleCard title="Table">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <InputGroup className="w-64">
            <InputGroupAddon>
              <IconSearch className="text-muted-foreground size-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search employees..." />
          </InputGroup>
          <Button variant="outline" size="sm">
            <IconFilter className="size-4" />
            Filter
          </Button>
        </div>

        <Table>
          <TableCaption>List of all employees in the organization</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-mono text-xs">{emp.id}</TableCell>
                <TableCell className="font-medium">{emp.name}</TableCell>
                <TableCell>{emp.role}</TableCell>
                <TableCell>
                  <Badge variant="outline">{emp.department}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={emp.status === 'Active' ? 'default' : 'secondary'}
                  >
                    {emp.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={currentPage === 1}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={currentPage === 2}>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive={currentPage === 3}>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </ExampleCard>
  )
}

const DialogSheetExample = () => {
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()

  return (
    <ExampleCard title="Dialog & Sheet">
      <div className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="outline">
                <IconCreditCard className="size-4" />
                View Benefits
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Employee Benefits</DialogTitle>
              <DialogDescription>
                Review and manage employee benefits package
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Health Insurance</p>
                  <p className="text-muted-foreground text-sm">
                    Premium plan - Family coverage
                  </p>
                </div>
                <Badge>Active</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">401(k) Matching</p>
                  <p className="text-muted-foreground text-sm">
                    6% company match
                  </p>
                </div>
                <Badge>Enrolled</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">PTO Allowance</p>
                  <p className="text-muted-foreground text-sm">
                    20 days per year
                  </p>
                </div>
                <Badge variant="secondary">12 days remaining</Badge>
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Close</Button>} />
              <Button>Download Summary</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={
              <Button variant="outline">
                <IconCalendar className="size-4" />
                Leave Request
              </Button>
            }
          />
          <SheetContent>
            <SheetHeader>
              <SheetTitle>New Leave Request</SheetTitle>
              <SheetDescription>
                Submit a leave request for approval
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 p-4">
              <Field>
                <FieldLabel>Leave Type</FieldLabel>
                <Select defaultValue={null}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="bereavement">Bereavement</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Start Date</FieldLabel>
                <DatePicker
                  date={startDate}
                  onDateChange={setStartDate}
                  placeholder="Select start date"
                />
              </Field>
              <Field>
                <FieldLabel>End Date</FieldLabel>
                <DatePicker
                  date={endDate}
                  onDateChange={setEndDate}
                  placeholder="Select end date"
                />
              </Field>
              <Field>
                <FieldLabel>Reason</FieldLabel>
                <Textarea placeholder="Brief description..." />
              </Field>
            </div>
            <SheetFooter>
              <SheetClose render={<Button variant="outline">Cancel</Button>} />
              <Button
                onClick={() => {
                  setSheetOpen(false)
                  toast.success('Leave request submitted')
                }}
              >
                Submit Request
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </ExampleCard>
  )
}

const AccordionExample = () => {
  return (
    <ExampleCard title="Accordion">
      <Accordion className="w-full">
        <AccordionItem value="attendance">
          <AccordionTrigger>Attendance Policy</AccordionTrigger>
          <AccordionContent>
            Employees are expected to work their scheduled hours. Core working
            hours are from 9:00 AM to 5:00 PM, Monday through Friday. Flexible
            working arrangements may be available with manager approval.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pto">
          <AccordionTrigger>Time Off Policy</AccordionTrigger>
          <AccordionContent>
            Full-time employees receive 20 days of paid time off per year,
            accruing monthly. Unused PTO can be carried over up to 5 days into
            the next calendar year. All time off must be requested at least 2
            weeks in advance.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="remote">
          <AccordionTrigger>Remote Work Guidelines</AccordionTrigger>
          <AccordionContent>
            Hybrid work schedule allows for up to 3 remote work days per week.
            Employees must maintain productivity and be available during core
            hours. All remote work arrangements require manager approval.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ExampleCard>
  )
}

const CommandExample = () => {
  return (
    <ExampleCard title="Command Palette">
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Press{' '}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>{' '}
          or click below to open the HR command palette
        </p>
        <CommandPaletteButton />
      </div>
    </ExampleCard>
  )
}

function EmptyStateExample() {
  return (
    <ExampleCard title="Empty State">
      <Empty className="rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconCheck className="size-6" />
          </EmptyMedia>
          <EmptyTitle>All Caught Up!</EmptyTitle>
          <EmptyDescription>
            No pending approvals or tasks requiring your attention. Enjoy your
            day!
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </ExampleCard>
  )
}

const ToggleTooltipExample = () => {
  return (
    <ExampleCard title="Toggle & Tooltip">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">View Toggle</p>
          <ButtonGroup>
            <Button variant="outline" size="sm">
              <IconUsers className="size-4" />
            </Button>
            <Button variant="outline" size="sm">
              <IconFileText className="size-4" />
            </Button>
          </ButtonGroup>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">With Tooltip</p>
          <div className="flex flex-wrap items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Toggle aria-label="Toggle grid view">
                      <IconUsers className="size-4" />
                    </Toggle>
                  }
                />
                <TooltipContent>
                  <p>Toggle Grid View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Toggle variant="outline" aria-label="Toggle list view">
                      <IconFileText className="size-4" />
                    </Toggle>
                  }
                />
                <TooltipContent>
                  <p>Toggle List View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toast.success('Copied to clipboard')}
                    >
                      <IconCopy className="size-4" />
                    </Button>
                  }
                />
                <TooltipContent>
                  <p>Copy Employee ID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="outline">
                    <IconUser className="size-4" />
                    Quick Actions
                  </Button>
                }
              />
              <PopoverContent className="w-56">
                <PopoverHeader>
                  <PopoverTitle>Employee Actions</PopoverTitle>
                  <PopoverDescription>
                    Common tasks for this employee
                  </PopoverDescription>
                </PopoverHeader>
                <div className="grid gap-2">
                  <Button variant="ghost" size="sm" className="justify-start">
                    <IconMail className="mr-2 size-4" />
                    Send Email
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    <IconCalendar className="mr-2 size-4" />
                    Schedule Meeting
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    <IconFolder className="mr-2 size-4" />
                    View Documents
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </ExampleCard>
  )
}

const PaginationExample = () => {
  return (
    <ExampleCard title="Pagination">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Showing 1-10 of 156 employees
          </span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Page</span>
            <Kbd>1</Kbd>
            <span className="text-muted-foreground">of 16</span>
          </div>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </ExampleCard>
  )
}

interface ExampleCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

const ExampleCard = ({ title, children, className }: ExampleCardProps) => {
  return (
    <div className={cn('break-inside-avoid space-y-3', className)}>
      <h3 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {title}
      </h3>
      <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
        {children}
      </div>
    </div>
  )
}

export { ExampleCard }
