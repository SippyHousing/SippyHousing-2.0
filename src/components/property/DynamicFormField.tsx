import { Control, Controller, FieldValues, Path, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryField } from "@/config/commonFields";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPriceInWords } from "@/lib/utils";

interface DynamicFormFieldProps<T extends FieldValues> {
  field: CategoryField;
  control: Control<T>;
  value?: string | number | undefined;
}

export function DynamicFormField<T extends FieldValues>({
  field,
  control,
  value
}: DynamicFormFieldProps<T>) {
  const fieldName = field.key as Path<T>;
  const isPriceField = ['price', 'price_range', 'sale_price', 'price_international', 'pre_leased_sale_price', 'pre_leased_rent_price'].includes(field.key);
  const watchedValue = useWatch({ control, name: fieldName });
  const priceInWords = isPriceField ? getPriceInWords(watchedValue) : '';

  // Handle conditional fields (call useWatch unconditionally)
  const conditionalFieldName = (field.conditional?.field ?? fieldName) as Path<T>;
  const conditionalValue = useWatch({ control, name: conditionalFieldName });
//
//
  if (field.conditional) {
    const { value: condValue, values: condValues } = field.conditional;
    const showWhenValues = condValues && Array.isArray(condValues) && condValues.includes(conditionalValue);
    const showWhenValue = condValue !== undefined && conditionalValue === condValue;
    if (!showWhenValues && !showWhenValue) return null;
  }

  switch (field.type) {
    case 'text':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key}>{field.name}</Label>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <>
                <Input
                  id={field.key}
                  {...controllerField}
                  placeholder={field.placeholder}
                  value={controllerField.value || ''}
                />
                {priceInWords && <p className="text-sm text-gray-600 mt-1">In words: {priceInWords}</p>}
              </>
            )}
          />
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key}>{field.name}</Label>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Input
                id={field.key}
                type="number"
                {...controllerField}
                placeholder={field.placeholder}
                value={controllerField.value || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  controllerField.onChange(val === '' ? undefined : Number(val));
                }}
              />
            )}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key}>{field.name}</Label>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Textarea
                id={field.key}
                {...controllerField}
                placeholder={field.placeholder}
                rows={field.rows || 4}
                value={controllerField.value || ''}
              />
            )}
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key}>{field.name}</Label>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Select
                value={controllerField.value || ''}
                onValueChange={controllerField.onChange}
              >
                <SelectTrigger id={field.key}>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      );

    case 'multiselect':
      return (
        <div className="space-y-2">
          <Label>{field.name}</Label>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => {
              const selectedValues = (controllerField.value as string[]) || [];
              
              return (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map((option) => {
                      const isSelected = selectedValues.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              controllerField.onChange(
                                selectedValues.filter((v) => v !== option)
                              );
                            } else {
                              controllerField.onChange([...selectedValues, option]);
                            }
                          }}
                          className={`
                            px-3 py-1.5 rounded-md text-sm border transition-colors
                            ${
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background border-input hover:bg-accent'
                            }
                          `}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {selectedValues.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedValues.join(', ')}
                    </p>
                  )}
                </div>
              );
            }}
          />
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Checkbox
                id={field.key}
                checked={controllerField.value || false}
                onCheckedChange={controllerField.onChange}
              />
            )}
          />
          <Label htmlFor={field.key} className="font-normal cursor-pointer">
            {field.name}
          </Label>
        </div>
      );

    case 'url':
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key}>{field.name}</Label>
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Input
                id={field.key}
                type="url"
                {...controllerField}
                placeholder={field.placeholder || 'https://...'}
                value={controllerField.value || ''}
              />
            )}
          />
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key}>{field.name}</Label>
          <Input
            id={field.key}
            placeholder={field.placeholder}
            value={value || ''}
            readOnly
          />
        </div>
      );
  }
}

// Component for fields with unit selectors
interface FieldWithUnitProps<T extends FieldValues> {
  field: CategoryField;
  control: Control<T>;
}

export function FieldWithUnit<T extends FieldValues>({
  field,
  control
}: FieldWithUnitProps<T>) {
  const fieldName = field.key as Path<T>;
  const unitFieldName = (field.unit || '') as Path<T>;

  if (!field.unit || !field.unitOptions) {
    return <DynamicFormField field={field} control={control} />;
  }

  return (
    <div className="space-y-2">
      <Label>{field.name}</Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Controller
            name={fieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Input
                {...controllerField}
                placeholder={field.placeholder}
                value={controllerField.value || ''}
              />
            )}
          />
        </div>
        <div className="w-32">
          <Controller
            name={unitFieldName}
            control={control}
            render={({ field: controllerField }) => (
              <Select
                value={controllerField.value || ''}
                onValueChange={controllerField.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {field.unitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
