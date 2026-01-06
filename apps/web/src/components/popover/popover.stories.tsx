import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "../button/button";
import { Input } from "../input/input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const AlignStart: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Align Start</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <p className="text-sm">This popover is aligned to the start.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Align End</Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <p className="text-sm">This popover is aligned to the end.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Profile</h4>
            <p className="text-muted-foreground text-sm">Update your profile information.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="name" className="text-sm">
                Name
              </label>
              <Input id="name" defaultValue="John Doe" className="col-span-2" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <Input id="email" type="email" defaultValue="john@example.com" className="col-span-2" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const AllAlignments: Story = {
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Start</Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <p className="text-sm">Aligned to start</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Center</Button>
        </PopoverTrigger>
        <PopoverContent align="center">
          <p className="text-sm">Aligned to center</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">End</Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <p className="text-sm">Aligned to end</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
