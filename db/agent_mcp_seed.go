package db

import "github.com/Autumn-27/artex/locale"

// seedAgentMCPBindings restores an agent's gateway binding for MCP servers that
// are user data (the bolt row carries a host-specific URL and bearer token, so it
// cannot be seeded itself). Without this, losing only the agent row would leave a
// re-created agent with skills but no arsenal. Insert-if-absent so a later toggle-off
// is never resurrected; a missing server name is a no-op.
func (d *DB) seedAgentMCPBindings(agentKey string, serverNames ...string) error {
	for _, name := range serverNames {
		if _, err := d.Exec(`
INSERT INTO agent_visibility(agent_id, resource_kind, resource_id, enabled)
SELECT a.id, 'mcp', m.id, true FROM agents a, mcp_servers m
WHERE a.key=$1 AND m.name=$2
  AND NOT EXISTS (SELECT 1 FROM agent_visibility v
                  WHERE v.agent_id=a.id AND v.resource_kind='mcp' AND v.resource_id=m.id)`,
			agentKey, name); err != nil {
			return locale.Errorf("bind mcp %s to agent %s: %w", name, agentKey, err)
		}
	}
	return nil
}
