---
name: offensive-network-attacks
description: "Dense description covering ARP spoofing, LLMNR/NBT-NS/mDNS poisoning, DNS poisoning, MITM attacks, VLAN hopping, DHCP attacks, 802.1X/NAC bypass, IPv6 attacks. Tools: Bettercap, Responder, mitm6, Ettercap, Wireshark. MITRE T1557, T1040. Use when conducting internal network assessments or testing Layer 2/3 attack surface. Use when: responder, mitm6, bettercap, ettercap, arpspoof, network sniffing, credential capture, rogue DHCP, spanning tree attacks, network pivoting"---

# Network Attacks (Layer 2/3) -- Offensive Methodology

You are attacking Layer 2/3 infrastructure during an authorized internal engagement. ARP, DHCP, broadcast name resolution, VLAN trunking, and IPv6 autoconfiguration are all unauthenticated -- you exploit that trust to intercept credentials, redirect traffic, and cross network boundaries.

## Quick Workflow

1. Map your position -- VLAN, subnet, gateway, DNS, DHCP lease, IPv6 status.
2. Passively sniff with tcpdump/Wireshark to discover hosts and cleartext credentials.
3. Run Responder in analyze mode to observe LLMNR/NBT-NS/mDNS queries.
4. Enable Responder poisoning to capture NTLMv2 hashes.
5. Relay captured hashes with ntlmrelayx against hosts without SMB signing.
6. ARP spoof the gateway for targeted MITM and credential interception.
7. Probe VLAN boundaries via DTP negotiation and 802.1Q double tagging.
8. Exploit IPv6 autoconfiguration with mitm6 for DNS takeover and NTLM relay.

---

## offensive-network-attacks

claude-red library skill — category: network.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-network-attacks`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/network/offensive-network-attacks/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
