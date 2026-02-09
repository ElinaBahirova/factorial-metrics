import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "factorial-red",
  colors: {
    "factorial-red": [
      "#fff0f1",
      "#ffdee1",
      "#ffbcc3",
      "#ff97a2",
      "#f04e61",
      "#e03e52",
      "#cf2e43",
      "#bc1e34",
      "#a81026",
      "#940018",
    ],
    "factorial-teal": [
      "#e6f6f7",
      "#cceef0",
      "#99dde1",
      "#66cccd",
      "#54a5ab",
      "#438489",
      "#326367",
      "#214244",
      "#112122",
      "#081011",
    ],
    "factorial-grey": [
      "#f9f9f9",
      "#f1f1f1",
      "#e8e8e8",
      "#d1d1d1",
      "#b3b3b3",
      "#8e8e8e",
      "#717171",
      "#555555",
      "#333333",
      "#1a1a1a",
    ],
    "factorial-blue": [
      "#eef2ff",
      "#e0e7ff",
      "#c7d2fe",
      "#a5b4fc",
      "#6366f1",
      "#4f46e5",
      "#4338ca",
      "#3730a3",
      "#312e81",
      "#1e1b4b",
    ],
    "factorial-amber": [
      "#fffbeb",
      "#fef3c7",
      "#fde68a",
      "#fcd34d",
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#92400e",
      "#78350f",
      "#451a03",
    ],
  },
  components: {
    Modal: {
      defaultProps: {
        size: "sm",
        radius: "md",
        closeOnClickOutside: true,
        closeOnEscape: true,
        centered: true,
      },
    },
    Input: {
      styles: () => ({
        wrapper: {
          "--input-bd-focus": "var(--mantine-color-factorial-teal-4)",
        },
      }),
    },
    TextInput: {
      styles: () => ({
        label: {
          ".mantine-TextInput-root:focus-within &": {
            color: "var(--mantine-color-factorial-teal-4)",
          },
        },
      }),
    },
    Select: {
      styles: () => ({
        wrapper: {
          "--input-bd-focus": "var(--mantine-color-factorial-teal-4)",
        },
      }),
    },
  },
});