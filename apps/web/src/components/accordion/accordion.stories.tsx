import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
    },
    collapsible: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: "single", collapsible: true },
  render: () => (
    <Accordion type="single" collapsible className="w-100">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. It&apos;s animated by default, but you can disable it if you prefer.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: { type: "multiple" },
  render: () => (
    <Accordion type="multiple" className="w-100">
      <AccordionItem value="item-1">
        <AccordionTrigger>First Section</AccordionTrigger>
        <AccordionContent>This is the first section content. You can open multiple sections at once.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second Section</AccordionTrigger>
        <AccordionContent>This is the second section content. Try opening both sections.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third Section</AccordionTrigger>
        <AccordionContent>This is the third section content. All three can be open at once.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const SingleNonCollapsible: Story = {
  args: { type: "single", collapsible: false },
  render: () => (
    <Accordion type="single" defaultValue="item-1" className="w-100">
      <AccordionItem value="item-1">
        <AccordionTrigger>Always One Open</AccordionTrigger>
        <AccordionContent>In non-collapsible mode, one item must always be open.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Try to close me</AccordionTrigger>
        <AccordionContent>You cannot close all items - one must remain open.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithDefaultOpen: Story = {
  args: { type: "single", collapsible: true, defaultValue: "item-2" },
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-2" className="w-100">
      <AccordionItem value="item-1">
        <AccordionTrigger>First Item</AccordionTrigger>
        <AccordionContent>First item content.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second Item (Default Open)</AccordionTrigger>
        <AccordionContent>This item is open by default using defaultValue prop.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third Item</AccordionTrigger>
        <AccordionContent>Third item content.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
