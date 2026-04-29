# Customer Upgrade Guide



### Fix AppShell desktop sidebar collapse/layout and web notification dismissal behavior.
- @contractspec/lib.design-system@4.4.1 (patch)
- Integrator: AppShell now keeps the desktop topbar inset beside the sidebar, exposes a shared sidebar collapse trigger, and dismisses the web notification panel on outside click, Escape, or trigger toggle.



### Fix AppShell desktop sidebar collapse/layout and web notification dismissal behavior.
- No manual migration steps recorded.

### Fix FormSpec phone country-select rendering to remove duplicated country adornments.
- @contractspec/lib.design-system@4.4.1 (patch)
- Customer: Split FormSpec phone fields now show one clear country selector instead of duplicating the flag and calling code beside the select.
- Integrator: Design-system phone country options now honor the configured flag/calling-code display parts, while the selected country control owns those adornments in select mode.



### Fix FormSpec phone country-select rendering to remove duplicated country adornments.
- Customer: Split FormSpec phone fields now show one clear country selector instead of duplicating the flag and calling code beside the select.
- No manual migration steps recorded.