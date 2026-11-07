"use client";

import { translate as swt } from "@/i18n/runtime";
import { useI18n } from "@/i18n";
import * as React from "react";
import { toast } from "sonner";
import { Bot, PlusIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AgentEditor } from "@/components/agent-editor";
import { api } from "@/lib/api";
import type { Agent, LLMProfile, Tool } from "@/lib/types";

// AgentGridCard is one clickable tile opening the agent's editor drawer. Custom
// (non-builtin) agents get a delete button.
function AgentGridCard({
  agent,
  onOpen,
  onDeleted,
}: {
  agent: Agent;
  onOpen: () => void;
  onDeleted: () => void;
}) {
  "use no memo";
  const { t: swt, locale: swLocale } = useI18n();

  async function del() {
    try {
      await api.deleteAgent(agent.key);
      toast.success(swt("interface.m1134", { p0: agent.name }));
      onDeleted();
    } catch (e) {
      toast.error(swt("interface.m0110") + (e as Error).message);
    }
  }
  return (
    <div className="hover:border-primary/50 group relative flex flex-col gap-2 rounded-lg border p-4 transition-colors">
      <button type="button" onClick={onOpen} className="flex flex-col gap-2 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <Bot className="text-muted-foreground size-4" />
          <span className="text-sm font-medium">{agent.name}</span>
          <span className="text-muted-foreground font-mono text-xs">{agent.key}</span>
          {agent.builtin ? (
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
              {swt("interface.m1135")}</Badge>
          ) : (
            <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
              {swt("interface.m0081")}</Badge>
          )}
          {!agent.enabled && (
            <Badge variant="outline" className="text-destructive px-1.5 py-0 text-[10px]">
              {swt("interface.m1069")}</Badge>
          )}
        </div>
        <p className="text-muted-foreground line-clamp-2 min-h-8 text-xs">
          {agent.description || swt("interface.m1136")}
        </p>
        <div className="text-muted-foreground flex flex-wrap gap-1.5 text-[10px]">
          <span className="rounded border px-1.5 py-0.5">MCP {agent.mcp_count ?? 0}</span>
          <span className="rounded border px-1.5 py-0.5">{swt("english.e084")}{" "}{agent.skill_count ?? 0}</span>
          <span className="rounded border px-1.5 py-0.5">{swt("interface.m0292")}{" "}{agent.tool_count ?? 0}</span>
        </div>
      </button>
      {!agent.builtin && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2Icon className="size-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{swt("interface.m1137")}{agent.name}」？</AlertDialogTitle>
              <AlertDialogDescription>
                {swt("interface.m1138")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{swt("interface.m0063")}</AlertDialogCancel>
              <AlertDialogAction onClick={del}>{swt("interface.m0101")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

// CreateAgentDialog gives a new agent its real configuration at birth, then the
// page opens the full editor drawer (create → configure in one flow). The
// platform creates agents from {key, name, description}; every other setting
// rides the same endpoints the editor saves through: PUT /agents/{key}/config,
// PUT /agents/{key}/prompt, PUT /tools/{key}.
function CreateAgentDialog({ onCreated }: { onCreated: (key: string) => void }) {
  "use no memo";
  const { t: swt } = useI18n();

  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [modelId, setModelId] = React.useState("");
  const [system, setSystem] = React.useState("");
  const [webSearch, setWebSearch] = React.useState(false);
  const [interactiveShell, setInteractiveShell] = React.useState(false);
  const [grants, setGrants] = React.useState<string[]>([]);
  const [profiles, setProfiles] = React.useState<LLMProfile[]>([]);
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [busy, setBusy] = React.useState(false);

  // Load the model + tool catalogs when the dialog opens so the birth settings
  // list what the platform actually has.
  React.useEffect(() => {
    if (!open) return;
    api
      .llmProfiles()
      .then(setProfiles)
      .catch(() => setProfiles([]));
    api
      .tools()
      .then(setTools)
      .catch(() => setTools([]));
  }, [open]);

  function toggleGrant(toolKey: string) {
    setGrants((prev) => (prev.includes(toolKey) ? prev.filter((g) => g !== toolKey) : [...prev, toolKey]));
  }

  function reset() {
    setKey("");
    setName("");
    setDescription("");
    setModelId("");
    setSystem("");
    setWebSearch(false);
    setInteractiveShell(false);
    setGrants([]);
  }

  async function create() {
    setBusy(true);
    try {
      const a = await api.createAgent(key.trim(), name.trim(), description.trim());
      const agentKey = a.key;
      // Birth settings ride the editor's own save endpoints. Each step is
      // independent: a failure is reported but never loses the agent.
      const failures: string[] = [];
      try {
        const patch: Parameters<typeof api.saveAgentConfig>[1] = {};
        if (modelId) patch.llm_profile_id = Number(modelId);
        if (webSearch) patch.web_search = true;
        if (interactiveShell) patch.interactive_shell = true;
        if (Object.keys(patch).length > 0) await api.saveAgentConfig(agentKey, patch);
      } catch (e) {
        failures.push(`config: ${(e as Error).message}`);
      }
      if (system.trim()) {
        try {
          await api.saveAgentPrompt(agentKey, system, "initial");
        } catch (e) {
          failures.push(`prompt: ${(e as Error).message}`);
        }
      }
      for (const toolKey of grants) {
        const tool = tools.find((x) => x.key === toolKey);
        if (!tool) continue;
        try {
          await api.saveTool(toolKey, {
            description: tool.description,
            schema: tool.schema,
            enabled: tool.enabled,
            agents: tool.agents.includes(agentKey) ? tool.agents : [...tool.agents, agentKey],
          });
        } catch (e) {
          failures.push(`${toolKey}: ${(e as Error).message}`);
        }
      }
      if (failures.length > 0) {
        toast.error(swt("english.e199", { p0: a.name, p1: failures.join("; ") }));
      } else {
        toast.success(swt("interface.m1139", { p0: a.name }));
      }
      setOpen(false);
      reset();
      onCreated(agentKey);
    } catch (e) {
      toast.error(swt("interface.m1027") + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const keyOk = /^[a-z][a-z0-9_]*$/.test(key.trim());
  const canCreate = keyOk && name.trim().length > 0 && !busy;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon /> {swt("interface.m1140")}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{swt("interface.m1141")}</DialogTitle>
          <DialogDescription>
            {swt("interface.m1142")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="agent-key">{swt("english.e085")}</Label>
            <Input
              id="agent-key"
              placeholder={swt("interface.m1143")}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="font-mono"
            />
            {key.length > 0 && !keyOk && (
              <span className="text-destructive text-xs">{swt("interface.m1144")}</span>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="agent-name">{swt("interface.m0868")}</Label>
            <Input
              id="agent-name"
              placeholder={swt("interface.m1145")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="agent-desc">{swt("interface.m0605")}</Label>
            <Textarea
              id="agent-desc"
              placeholder={swt("interface.m1146")}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="agent-model">{swt("interface.m1917")}</Label>
            <Select value={modelId || "__follow__"} onValueChange={(v) => setModelId(v === "__follow__" ? "" : v)}>
              <SelectTrigger id="agent-model" className="w-full">
                <SelectValue placeholder={swt("interface.m1918")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__follow__">{swt("interface.m1918")}</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}（{p.model}）{p.is_default ? swt("interface.m1919") : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="agent-system">{swt("english.e192")}</Label>
            <Textarea
              id="agent-system"
              placeholder={swt("english.e193")}
              rows={4}
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-muted-foreground text-xs">{swt("english.e200")}</p>
          </div>
          <div className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Switch id="agent-web-search" checked={webSearch} onCheckedChange={setWebSearch} />
              <Label htmlFor="agent-web-search" className="text-sm">
                {swt("interface.m1187")}
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="agent-shell" checked={interactiveShell} onCheckedChange={setInteractiveShell} />
              <Label htmlFor="agent-shell" className="text-sm">
                {swt("interface.m1925")}
              </Label>
            </div>
          </div>
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="agent-grants">{swt("english.e194")}</Label>
              {grants.length > 0 && (
                <span className="text-muted-foreground text-xs">
                  {swt("english.e195", { p0: String(grants.length) })}
                </span>
              )}
            </div>
            {tools.length === 0 ? (
              <p className="text-muted-foreground rounded-md border px-3 py-2 text-xs">{swt("interface.m1973")}</p>
            ) : (
              <div className="grid max-h-44 gap-1 overflow-y-auto rounded-md border p-3">
                {tools.map((tool) => {
                  const checked = grants.includes(tool.key);
                  return (
                    <label
                      key={tool.key}
                      className="hover:bg-accent/50 flex cursor-pointer items-start gap-2 rounded px-1 py-0.5"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleGrant(tool.key)}
                        className="mt-0.5"
                        aria-label={tool.key}
                      />
                      <span className="min-w-0 text-xs leading-5">
                        <span className="font-mono">{tool.key}</span>
                        {!tool.enabled && <span className="text-muted-foreground"> · {swt("interface.m1069")}</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
            <p className="text-muted-foreground text-xs">{swt("english.e196")}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={create} disabled={!canCreate}>
            {swt("interface.m0995")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AgentsPage() {
  "use no memo";
  const { t: swt } = useI18n();

  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [offline, setOffline] = React.useState(false);
  const [editKey, setEditKey] = React.useState<string | null>(null);

  const reload = React.useCallback(() => {
    api
      .agents()
      .then((list) => {
        setAgents(list);
        setOffline(false);
      })
      .catch(() => {
        // Unreachable platform API is NOT an empty store: say so instead of
        // silently rendering "(no agents)".
        setAgents([]);
        setOffline(true);
      });
  }, []);
  React.useEffect(() => {
    reload();
  }, [reload]);

  const editing = agents.find((a) => a.key === editKey) ?? null;

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{swt("english.e082")}</h1>
          <p className="text-muted-foreground text-sm">
            {swt("interface.m1147")}</p>
        </div>
        <CreateAgentDialog
          onCreated={(key) => {
            reload();
            setEditKey(key);
          }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{swt("interface.m1148")}</CardTitle>
          <CardDescription>{swt("interface.m0199")}{" "}{agents.length} {swt("interface.m0862")}</CardDescription>
        </CardHeader>
        <CardContent>
          {offline ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <p className="text-sm font-medium">{swt("english.e197")}</p>
              <p className="text-muted-foreground max-w-md text-sm">{swt("english.e198")}</p>
            </div>
          ) : agents.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">{swt("interface.m1149")}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((a) => (
                <AgentGridCard key={a.key} agent={a} onOpen={() => setEditKey(a.key)} onDeleted={reload} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditKey(null)}>
        <SheetContent
          side="right"
          className="flex flex-col gap-0 p-0 data-[side=right]:w-[45vw] data-[side=right]:sm:max-w-[45vw]"
        >
          {editing && (
            <>
              <SheetHeader className="px-4">
                <SheetTitle className="flex items-center gap-2">
                  {editing.name}
                  <span className="text-muted-foreground font-mono text-xs">{editing.key}</span>
                  {!editing.builtin && (
                    <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                      {swt("interface.m0081")}</Badge>
                  )}
                </SheetTitle>
                <SheetDescription>{editing.description || swt("interface.m1150")}</SheetDescription>
              </SheetHeader>
              <AgentEditor agentKey={editing.key} onSaved={reload} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
