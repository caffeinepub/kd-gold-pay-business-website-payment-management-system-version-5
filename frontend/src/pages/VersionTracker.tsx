import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileDown,
  Plus,
  FileText,
  FileArchive,
  Search,
  ArrowUpDown,
  Calendar,
  GitBranch,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

interface VersionEntry {
  id: string;
  version: string;
  date: string;
  description: string;
  changes: string;
  type: 'major' | 'minor' | 'patch';
}

export default function VersionTracker() {
  const [versions, setVersions] = useState<VersionEntry[]>(() => {
    const stored = localStorage.getItem('kd-gold-pay-versions');
    return stored ? JSON.parse(stored) : [];
  });

  const [formData, setFormData] = useState({
    version: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    changes: '',
    type: 'minor' as 'major' | 'minor' | 'patch',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'version'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'major' | 'minor' | 'patch'>('all');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddVersion = () => {
    if (!formData.version.trim() || !formData.description.trim()) {
      toast.error('Please fill in version number and description');
      return;
    }

    const newVersion: VersionEntry = {
      id: Date.now().toString(),
      ...formData,
    };

    const updatedVersions = [newVersion, ...versions];
    setVersions(updatedVersions);
    localStorage.setItem('kd-gold-pay-versions', JSON.stringify(updatedVersions));

    setFormData({
      version: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      changes: '',
      type: 'minor',
    });

    toast.success('Version entry added successfully');
  };

  const filteredAndSortedVersions = useMemo(() => {
    let filtered = versions;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.version.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query) ||
          v.changes.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((v) => v.type === filterType);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // Sort by version number
        const versionCompare = a.version.localeCompare(b.version, undefined, { numeric: true });
        return sortOrder === 'asc' ? versionCompare : -versionCompare;
      }
    });

    return sorted;
  }, [versions, searchQuery, sortBy, sortOrder, filterType]);

  const generateExportContent = (): string => {
    let content = 'KD GOLD PAY - VERSION TRACKER\n';
    content += '================================\n\n';
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Total Versions: ${versions.length}\n\n`;

    filteredAndSortedVersions.forEach((version, index) => {
      content += `${index + 1}. VERSION ${version.version} [${version.type.toUpperCase()}]\n`;
      content += `   Date: ${version.date}\n`;
      content += `   Description: ${version.description}\n`;
      if (version.changes) {
        content += `   Changes:\n   ${version.changes.split('\n').join('\n   ')}\n`;
      }
      content += '\n';
    });

    return content;
  };

  const exportToFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const content = generateExportContent();
    exportToFile(`kd-gold-pay-versions-${Date.now()}.txt`, content);
    toast.success('Version data exported (PDF format placeholder)');
  };

  const exportToWord = () => {
    const content = generateExportContent();
    exportToFile(`kd-gold-pay-versions-${Date.now()}.txt`, content);
    toast.success('Version data exported (Word format placeholder)');
  };

  const exportToZIP = () => {
    const content = generateExportContent();
    exportToFile(`kd-gold-pay-versions-${Date.now()}.txt`, content);
    toast.success('Version data exported (ZIP format placeholder)');
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'destructive';
      case 'minor':
        return 'default';
      case 'patch':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Version Tracker</h2>
        <p className="text-muted-foreground">Manage and track version history with advanced analytics</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">
                <FileText className="mr-2 h-4 w-4" />
                Version List
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <GitBranch className="mr-2 h-4 w-4" />
                Timeline View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Version History</CardTitle>
                      <CardDescription>All recorded version entries</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={exportToPDF}>
                        <FileDown className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportToWord}>
                        <FileText className="mr-2 h-4 w-4" />
                        Word
                      </Button>
                      <Button variant="outline" size="sm" onClick={exportToZIP}>
                        <FileArchive className="mr-2 h-4 w-4" />
                        ZIP
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search versions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="major">Major</SelectItem>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="patch">Patch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-muted-foreground">Sort by:</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortBy('date')}
                        className={sortBy === 'date' ? 'bg-accent' : ''}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Date
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortBy('version')}
                        className={sortBy === 'version' ? 'bg-accent' : ''}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Version
                      </Button>
                      <Button variant="outline" size="sm" onClick={toggleSort}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {filteredAndSortedVersions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 rounded-full bg-muted p-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        {searchQuery || filterType !== 'all' ? 'No matching versions found' : 'No version entries yet'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery || filterType !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Add your first version entry to get started'}
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[120px]">Version</TableHead>
                              <TableHead className="w-[100px]">Type</TableHead>
                              <TableHead className="w-[120px]">Date</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Changes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredAndSortedVersions.map((version) => (
                              <TableRow key={version.id}>
                                <TableCell className="font-medium">{version.version}</TableCell>
                                <TableCell>
                                  <Badge variant={getTypeColor(version.type)}>{version.type}</Badge>
                                </TableCell>
                                <TableCell>{version.date}</TableCell>
                                <TableCell>{version.description}</TableCell>
                                <TableCell className="max-w-xs truncate">{version.changes || '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Version Timeline</CardTitle>
                  <CardDescription>Visual representation of version history</CardDescription>
                </CardHeader>
                <CardContent>
                  {versions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 rounded-full bg-muted p-4">
                        <GitBranch className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No version entries yet</p>
                      <p className="text-sm text-muted-foreground">Add your first version entry to see the timeline</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="relative space-y-8 pl-8">
                        <div className="absolute left-[11px] top-0 h-full w-0.5 bg-border" />
                        {filteredAndSortedVersions.map((version, index) => (
                          <div key={version.id} className="relative">
                            <div
                              className={`absolute -left-8 mt-1.5 h-6 w-6 rounded-full border-4 border-background ${
                                version.type === 'major'
                                  ? 'bg-destructive'
                                  : version.type === 'minor'
                                    ? 'bg-primary'
                                    : 'bg-secondary'
                              }`}
                            />
                            <Card className="ml-4">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg">Version {version.version}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                      <Calendar className="h-3 w-3" />
                                      {format(parseISO(version.date), 'MMMM dd, yyyy')}
                                    </CardDescription>
                                  </div>
                                  <Badge variant={getTypeColor(version.type)}>{version.type}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-2 font-medium">{version.description}</p>
                                {version.changes && (
                                  <div className="mt-3 rounded-md bg-muted p-3">
                                    <p className="mb-1 text-sm font-semibold">Changes:</p>
                                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                      {version.changes}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Add Version Entry</CardTitle>
              <CardDescription>Record a new version</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddVersion();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="version">Version Number *</Label>
                  <Input
                    id="version"
                    placeholder="e.g., 4.0.0"
                    value={formData.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Version Type *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => handleInputChange('type', value)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="patch">Patch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changes">Changes</Label>
                  <Textarea
                    id="changes"
                    placeholder="List of changes (optional)"
                    value={formData.changes}
                    onChange={(e) => handleInputChange('changes', e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Version Entry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
