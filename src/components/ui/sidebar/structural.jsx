"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Input } from "../input";
import { Separator } from "../separator";
import { cn } from "../utils";

export const SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

export const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";

export const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden", className)} {...props} />;
});
SidebarContent.displayName = "SidebarContent";

export const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("relative flex w-full min-w-0 flex-col p-2", className)} {...props} />;
});
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

export const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("w-full text-sm", className)} {...props} />;
});
SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return <Separator ref={ref} className={cn("mx-2 w-auto bg-sidebar-border", className)} {...props} />;
});
SidebarSeparator.displayName = "SidebarSeparator";