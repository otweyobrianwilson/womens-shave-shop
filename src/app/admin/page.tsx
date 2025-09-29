"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  RefreshCw, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Eye, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Filter,
  Download,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu
} from "lucide-react";

type CartItem = { id: string; name: string; price: number; qty: number };

type Order = {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  status?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      city?: string;
      district?: string;
      postal?: string;
      landmark?: string;
    };
  };
};

const ORDERS_CACHE = "orders-v1";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const collected: Order[] = [];

      // 1) From Cache Storage (service worker persisted)
      if (typeof window !== "undefined" && "caches" in window) {
        try {
          const cache = await caches.open(ORDERS_CACHE);
          const keys = await cache.keys();
          for (const req of keys) {
            try {
              const res = await cache.match(req);
              if (!res) continue;
              const data = (await res.json()) as Order;
              if (data && data.id) collected.push(data);
            } catch {}
          }
        } catch {}
      }

      // 2) From localStorage fallback
      try {
        const ls = JSON.parse(localStorage.getItem("orders") || "[]") as Order[];
        for (const o of ls) {
          if (!collected.find((c) => c.id === o.id)) collected.push(o);
        }
      } catch {}

      // Sort newest first
      collected.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(collected);
    } catch (e) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) {
      loadOrders();
    }
  }, [authed]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Friday#123") {
      setAuthed(true);
    } else {
      setError("Incorrect password");
    }
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
    const totalItems = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0
    );
    const uniqueCustomers = new Set(orders.map(order => order.customer?.email).filter(Boolean)).size;
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    const statusCounts = orders.reduce((acc, order) => {
      const status = order.status || "placed";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentOrders = orders.slice(0, 5);
    
    // Revenue by day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const revenueByDay = last7Days.map(date => {
      const dayOrders = orders.filter(order => 
        order.date.split('T')[0] === date
      );
      return {
        date,
        revenue: dayOrders.reduce((sum, order) => sum + order.subtotal, 0),
        orders: dayOrders.length
      };
    });

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalItems,
      uniqueCustomers,
      averageOrderValue,
      statusCounts,
      recentOrders,
      revenueByDay
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === "" || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        (order.status || "placed") === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "processing": return <Clock className="h-4 w-4" />;
      case "shipped": return <Package className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Admin Dashboard</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="off"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>Quick access to admin features</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 py-6">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <nav className="flex-1 px-2 pb-4 space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1 p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">Dashboard Overview</h2>
                <p className="text-gray-600 hidden lg:block">Monitor your store performance and manage orders</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0">
                <Button 
                  onClick={loadOrders} 
                  variant="outline" 
                  size="sm"
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {error && !loading && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">UGX {analytics.totalRevenue.toLocaleString("en-UG")}</div>
                      <p className="text-xs text-muted-foreground">
                        Avg: UGX {analytics.averageOrderValue.toLocaleString("en-UG")}/order
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                      <p className="text-xs text-muted-foreground">
                        {analytics.totalItems} items total
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Customers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.uniqueCustomers}</div>
                      <p className="text-xs text-muted-foreground">
                        Unique customers
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Growth</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+12%</div>
                      <p className="text-xs text-muted-foreground">
                        vs last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest orders from your store</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.recentOrders.map((order) => (
                        <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback>{order.customer?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">{order.customer?.name || "Anonymous"}</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
                            <Badge variant="outline" className={getStatusColor(order.status || "placed")}>
                              {getStatusIcon(order.status || "placed")}
                              <span className="ml-1">{order.status || "placed"}</span>
                            </Badge>
                            <span className="font-medium">UGX {order.subtotal.toLocaleString("en-UG")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>Search and filter your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search orders by ID, customer name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="placed">Placed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                <div className="flex items-center justify-center">
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Loading orders...
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : filteredOrders.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No orders found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{order.customer?.name || "Anonymous"}</div>
                                    <div className="text-sm text-muted-foreground">{order.customer?.email}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(order.status || "placed")}>
                                    {getStatusIcon(order.status || "placed")}
                                    <span className="ml-1">{order.status || "placed"}</span>
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-medium">UGX {order.subtotal.toLocaleString("en-UG")}</TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>Order Details</DialogTitle>
                                        <DialogDescription>
                                          Complete information for order #{order.id.slice(0, 8)}
                                        </DialogDescription>
                                      </DialogHeader>
                                      {selectedOrder && (
                                        <div className="space-y-6">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                              <h4 className="font-medium mb-2">Customer Information</h4>
                                              <div className="space-y-2 text-sm">
                                                <div className="flex items-center">
                                                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                                  {selectedOrder.customer?.name || "Anonymous"}
                                                </div>
                                                <div className="flex items-center">
                                                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                                  {selectedOrder.customer?.email || "N/A"}
                                                </div>
                                                <div className="flex items-center">
                                                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                                  {selectedOrder.customer?.phone || "N/A"}
                                                </div>
                                                <div className="flex items-start">
                                                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                                  <div>
                                                    {selectedOrder.customer?.address?.line1 || "N/A"}
                                                    {selectedOrder.customer?.address?.district && (
                                                      <div className="text-muted-foreground">
                                                        {selectedOrder.customer.address.district}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div>
                                              <h4 className="font-medium mb-2">Order Information</h4>
                                              <div className="space-y-2 text-sm">
                                                <div className="flex items-center">
                                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                                  {new Date(selectedOrder.date).toLocaleString()}
                                                </div>
                                                <div className="flex items-center">
                                                  <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                                                  <Badge variant="outline" className={getStatusColor(selectedOrder.status || "placed")}>
                                                    {selectedOrder.status || "placed"}
                                                  </Badge>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <Separator />
                                          
                                          <div>
                                            <h4 className="font-medium mb-4">Order Items</h4>
                                            <div className="space-y-3">
                                              {selectedOrder.items.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                                                  <div>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                      Quantity: {item.qty} × UGX {item.price.toLocaleString("en-UG")}
                                                    </div>
                                                  </div>
                                                  <div className="font-medium">
                                                    UGX {(item.price * item.qty).toLocaleString("en-UG")}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                            <Separator className="my-4" />
                                            <div className="flex justify-between items-center text-lg font-semibold">
                                              <span>Total</span>
                                              <span>UGX {selectedOrder.subtotal.toLocaleString("en-UG")}</span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Status Distribution</CardTitle>
                      <CardDescription>Breakdown of orders by status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(analytics.statusCounts).map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getStatusIcon(status)}
                              <span className="ml-2 capitalize">{status}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(count / analytics.totalOrders) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>Last 7 days performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.revenueByDay.map((day, index) => (
                          <div key={day.date} className="flex items-center justify-between">
                            <div className="text-sm">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ 
                                    width: `${analytics.totalRevenue > 0 ? (day.revenue / Math.max(...analytics.revenueByDay.map(d => d.revenue))) * 100 : 0}%` 
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-16 text-right">
                                UGX {day.revenue.toLocaleString("en-UG")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="customers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Overview</CardTitle>
                    <CardDescription>Manage your customer base</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Customer management features coming soon!</p>
                      <p className="text-sm">Advanced customer analytics and management tools will be available in the next update.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}