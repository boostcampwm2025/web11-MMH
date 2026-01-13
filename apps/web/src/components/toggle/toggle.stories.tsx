import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Toggle } from "./toggle";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
    componentSubtitle: "iOS 세그먼트 스타일의 슬라이딩 토글 버튼입니다.",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["default", "sm", "lg"],
      description: "토글 버튼의 크기를 설정합니다.",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    value: {
      control: "text",
      description: "현재 선택된 값입니다.",
    },
    options: {
      control: "object",
      description: "토글에 표시될 두 개의 옵션입니다.",
    },
    onChange: {
      action: "changed",
      description: "값이 변경될 때 호출되는 함수입니다.",
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToggleWithState = ({
  // story args에서 넘어오는 값들
  value: initialValue,
  onChange,
  ...props
}: React.ComponentProps<typeof Toggle>) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    // Actions 패널에 로그를 남기기 위해 원본 onChange도 호출
    if (onChange) {
      onChange(newValue);
    }
  };

  return <Toggle {...props} value={value} onChange={handleChange} />;
};

export const Default: Story = {
  args: {
    size: "default",
    value: "text",
    options: [
      { label: "텍스트", value: "text" },
      { label: "음성", value: "voice" },
    ],
    // [중요] onChange가 필수 prop이므로, 빈 함수라도 넣어주어야 TS 에러가 사라집니다.
    // 실제 동작은 render 함수의 ToggleWithState가 처리합니다.
    onChange: () => {},
  },
  render: (args) => <ToggleWithState {...args} />,
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: "sm",
    // Default.args를 복사했으므로 onChange도 포함되어 있습니다.
  },
  render: (args) => <ToggleWithState {...args} />,
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: "lg",
  },
  render: (args) => <ToggleWithState {...args} />,
};

export const OnOffSwitch: Story = {
  args: {
    size: "default",
    value: "on",
    options: [
      { label: "ON", value: "on" },
      { label: "OFF", value: "off" },
    ],
    onChange: () => {}, // 필수 prop 추가
  },
  render: (args) => <ToggleWithState {...args} />,
};
