"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects } from "@/constants";
import { createCompanion } from "@/lib/actions/companion.action";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  topic: z.string().min(2, { message: "Topic is required." }),
  voice: z.string().min(2, { message: "Voice is required." }),
  style: z.string().min(2, { message: "Style is required." }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration is required." })
    .max(60, { message: "Duration cannot exceed 60 minutes." }),
});

type FormValues = z.infer<typeof formSchema>;

const CompanionForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 10,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const companion = await createCompanion(values);

    if(companion) {
      console.log("Companion created successfully:", companion);
      redirect(`/companions/${companion.id}`);
    }
  };

  return (
    <div>
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Create companion</CardTitle>
          <CardDescription>
            Fill in the details to define your AI companion.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="companion-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={Boolean(form.formState.errors.name)}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter companion name"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={Boolean(form.formState.errors.name)}
                />
                {form.formState.errors.name && (
                  <FieldError errors={[form.formState.errors.name]} />
                )}
              </Field>

              <Field data-invalid={Boolean(form.formState.errors.subject)}>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Controller
                  name="subject"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                       {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.subject && (
                  <FieldError errors={[form.formState.errors.subject]} />
                )}
              </Field>


              <Field data-invalid={Boolean(form.formState.errors.voice)}>
                <FieldLabel htmlFor="voice">Voice</FieldLabel>
                 <Controller
                  name="voice"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                    <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
                {form.formState.errors.voice && (
                  <FieldError errors={[form.formState.errors.topic]} />
                )}
              </Field>

              <Field data-invalid={Boolean(form.formState.errors.topic)}>
                <FieldLabel htmlFor="topic">Topic</FieldLabel>
                <input
                  id="topic"
                  {...form.register("topic")}
                  placeholder="Enter topic"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={Boolean(form.formState.errors.topic)}
                />
                {form.formState.errors.topic && (
                  <FieldError errors={[form.formState.errors.topic]} />
                )}
              </Field>

              <Field data-invalid={Boolean(form.formState.errors.style)}>
                <FieldLabel htmlFor="style">Style</FieldLabel>
                <Controller 
                  name="style"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full" aria-invalid={Boolean(form.formState.errors.style)}>
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="informal">Informal</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.style && (
                  <FieldError errors={[form.formState.errors.style]} />
                )}
              </Field>

               <Field data-invalid={Boolean(form.formState.errors.duration)}>
                <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
                <input
                  id="duration"
                  type="number"
                  min={1}
                  max={60}
                  {...form.register("duration")}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={Boolean(form.formState.errors.duration)}
                />
                {form.formState.errors.duration && (
                  <FieldError errors={[form.formState.errors.duration]} />
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            <Button type="submit" form="companion-form" className="w-full">
              build companion
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompanionForm;