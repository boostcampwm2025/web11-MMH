import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Progress } from "./progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
  args: {
    value: 50,
    className: "w-[300px]",
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Quarter: Story = {
  args: {
    value: 25,
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
};

export const ThreeQuarters: Story = {
  args: {
    value: 75,
  },
};

export const Full: Story = {
  args: {
    value: 100,
  },
};

export const AllValues: Story = {
  render: () => (
    <div className="flex w-75 flex-col gap-4">
      <div className="space-y-1">
        <span className="text-sm">0%</span>
        <Progress value={0} />
      </div>
      <div className="space-y-1">
        <span className="text-sm">25%</span>
        <Progress value={25} />
      </div>
      <div className="space-y-1">
        <span className="text-sm">50%</span>
        <Progress value={50} />
      </div>
      <div className="space-y-1">
        <span className="text-sm">75%</span>
        <Progress value={75} />
      </div>
      <div className="space-y-1">
        <span className="text-sm">100%</span>
        <Progress value={100} />
      </div>
    </div>
  ),
};
