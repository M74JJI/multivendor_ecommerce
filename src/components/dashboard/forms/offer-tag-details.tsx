"use client";

// React
import { FC, useEffect } from "react";

// Prisma model
import { OfferTag } from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { OfferTagFormSchema } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Queries
import { upsertOfferTag } from "@/queries/offer-tag";

// Utils
import { v4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface OfferTagDetailsProps {
  data?: OfferTag;
}

const OfferTagDetails: FC<OfferTagDetailsProps> = ({ data }) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof OfferTagFormSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(OfferTagFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name,
      url: data?.url,
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        url: data?.url,
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof OfferTagFormSchema>) => {
    try {
      // Upserting category data
      const response = await upsertOfferTag({
        id: data?.id ? data.id : v4(),
        name: values.name,
        url: values.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Displaying success message
      toast({
        title: data?.id
          ? "Offer tag has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      });

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/offer-tags");
      }
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error.toString(),
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Offer Tag Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} offer tag information.`
              : " Lets create an offer tag. You can edit offer tag later from the offer tags table or the offer tag page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Offer tag name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Offer tag url</FormLabel>
                    <FormControl>
                      <Input placeholder="/offer-tag-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                  ? "Save offer tag information"
                  : "Create offer tag"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default OfferTagDetails;
