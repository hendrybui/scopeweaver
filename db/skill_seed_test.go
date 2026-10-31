package db

import (
	"os"
	"path/filepath"
	"testing"
)

// builtinSkillVisibility only carries the DB binding; the skill itself is a
// directory on the filesystem. A seeded name with no shipped SKILL.md would
// bind an agent to a skill that never resolves, so assert every name ships one.
func TestBuiltinSkillVisibilityNamesShipASkill(t *testing.T) {
	for name := range builtinSkillVisibility {
		path := filepath.Join("..", "skills", name, "SKILL.md")
		if _, err := os.Stat(path); err != nil {
			t.Errorf("builtinSkillVisibility[%q] has no skill: %v", name, err)
		}
	}
}
