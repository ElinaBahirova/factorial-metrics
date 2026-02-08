import {
  Paper,
  Select,
  NumberInput,
  Button,
  Modal,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  useMetricDefinitions,
  useCreateMetricDefinition,
  useCreateMetricValue,
} from "../../lib/metrics";
import { cn } from "../../lib/utils";
import styles from "./MetricForm.module.css";

export function MetricForm() {
  const [addModalOpen, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const { data: definitions = [], isLoading: definitionsLoading } =
    useMetricDefinitions();
  const createDefinition = useCreateMetricDefinition();
  const createValue = useCreateMetricValue();

  const valueForm = useForm({
    mode: "uncontrolled",
    initialValues: { metricId: "", value: "" },
    validate: {
      metricId: (v) => (!v ? "Select a metric" : null),
      value: (v) => {
        if (v === "" || v === undefined) return "Value is required";
        const n = Number(v);
        if (Number.isNaN(n)) return "Value must be a number";
        return null;
      },
    },
  });

  const definitionForm = useForm({
    mode: "uncontrolled",
    initialValues: { name: "", description: "", measure: "" },
    validate: {
      name: (v) => (!v || !v.trim() ? "Name is required" : null),
    },
  });

  const handleSubmitValue = valueForm.onSubmit((values) => {
    createValue.mutate(
      { metricId: values.metricId, value: Number(values.value) },
      { onSuccess: () => valueForm.reset() }
    );
  });

  const handleSubmitDefinition = definitionForm.onSubmit((values) => {
    createDefinition.mutate(
      {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        measure: values.measure?.trim() || undefined,
      },
      {
        onSuccess: () => {
          definitionForm.reset();
          closeAddModal();
        },
      }
    );
  });

  const selectData = definitions.map((d) => ({ value: d.id, label: d.name }));

  return (
    <>
      <Paper p="md" radius="md" withBorder>
        <form onSubmit={handleSubmitValue} className={styles.form}>
          <div className={styles.row}>
            <Select
              className={styles.field}
              classNames={{ option: styles.selectOption }}
              withCheckIcon={false}
              label="Metric"
              placeholder={definitionsLoading ? "Loading…" : "Select metric"}
              data={selectData}
              key={valueForm.key("metricId")}
              {...valueForm.getInputProps("metricId")}
              disabled={definitionsLoading}
            />
            <NumberInput
              className={styles.field}
              label="Value"
              placeholder="0"
              key={valueForm.key("value")}
              {...valueForm.getInputProps("value")}
            />
            <Button
              type="submit"
              className={cn(styles.submit)}
              loading={createValue.isPending}
              loaderProps={{ type: "dots" }}
              disabled={definitions.length === 0}
            >
              {createValue.isPending ? "Adding…" : "Add value"}
            </Button>
            <Button
              type="button"
              variant="light"
              className={styles.submit}
              onClick={openAddModal}
            >
              New metric type
            </Button>
          </div>
        </form>
      </Paper>

      <Modal
        opened={addModalOpen}
        classNames={{ header: styles.modalHeader, title: styles.modalTitle }}
        onClose={() => {
          closeAddModal();
          definitionForm.reset();
        }}
        title="Add metric type"
      >
        <form onSubmit={handleSubmitDefinition}>
          <TextInput
            label="Name"
            placeholder="e.g. Revenue"
            key={definitionForm.key("name")}
            {...definitionForm.getInputProps("name")}
            required
            data-autofocus
          />
          <TextInput
            label="Description"
            placeholder="e.g. Customers who have made a purchase"
            key={definitionForm.key("description")}
            {...definitionForm.getInputProps("description")}
            mt="sm"
          />
          <TextInput
            label="Measure"
            placeholder="e.g. percent, count, k€"
            key={definitionForm.key("measure")}
            {...definitionForm.getInputProps("measure")}
            mt="sm"
          />
          {createDefinition.isError && (
            <p
              style={{
                color: "var(--color-primary)",
                fontSize: "0.875rem",
                marginTop: 8,
              }}
            >
              {createDefinition.error?.message}
            </p>
          )}
          <Button
            type="submit"
            loading={createDefinition.isPending}
            mt="md"
            fullWidth
          >
            {createDefinition.isPending ? "Creating…" : "Create metric type"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
