import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url", "file"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
  args: {
    placeholder: "Enter text...",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "text",
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Type something here...",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "Enter email...",
  },
};

export const Number: Story = {
  args: {
    type: "number",
    placeholder: "Enter number...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Hello World",
  },
};

export const File: Story = {
  args: {
    type: "file",
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex w-75 flex-col gap-4">
      <Input type="text" placeholder="Text input" />
      <Input type="password" placeholder="Password input" />
      <Input type="email" placeholder="Email input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Tel input" />
      <Input type="url" placeholder="URL input" />
      <Input type="file" />
      <Input disabled placeholder="Disabled input" />
    </div>
  ),
};
