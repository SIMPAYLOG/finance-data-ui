"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format, addYears, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import type { FrontendFormDataItem } from "../types";

interface DateSelectProps {
  formData: FrontendFormDataItem;
  handleDateChange: (
    field: "durationStart" | "durationEnd",
    date: Date | undefined
  ) => void;
}
export default function DateSelector({
  formData,
  handleDateChange,
}: DateSelectProps) {
  const form = useForm();

  const [isStartOpen, setIsStartOpen] = React.useState(false);
  const [isEndOpen, setIsEndOpen] = React.useState(false);

  const durationEndConstraint = addYears(new Date(), 2);

  return (
    <Form {...form}>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>거래 데이터 생성 기간</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 items-start">
          <FormItem className="flex flex-col">
            <FormLabel>시작 날짜</FormLabel>
            <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.durationStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.durationStart ? (
                      format(formData.durationStart, "yyyy-MM-dd")
                    ) : (
                      <span>시작 날짜 선택</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.durationStart}
                  onSelect={(date) => {
                    handleDateChange("durationStart", date);
                    setIsStartOpen(false);
                  }}
                  locale={ko}
                  captionLayout="dropdown"
                  fromYear={2024}
                  toYear={new Date().getFullYear() + 1}
                  defaultMonth={formData.durationStart}  
                />
              </PopoverContent>
            </Popover>
            <FormDescription className="pt-1 text-xs">
              시작일로부터 최대 1년 이내의 날짜만 선택 가능합니다.
            </FormDescription>
            <FormMessage />
          </FormItem>
          <FormItem className="flex flex-col">
            <FormLabel>종료 날짜</FormLabel>
            <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    disabled={!formData.durationStart}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.durationStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.durationEnd ? (
                      format(formData.durationEnd, "yyyy-MM-dd")
                    ) : (
                      <span>종료 날짜 선택</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.durationEnd}
                  onSelect={(date) => {
                    handleDateChange("durationEnd", date);
                    setIsEndOpen(false);
                  }}
                  disabled={(date) =>{
                    if (!formData.durationStart) return true; // 시작 날짜 없으면 비활성화
                    const oneYearAfterStart = addYears(formData.durationStart, 1);
                    const effectiveEndDate = durationEndConstraint < oneYearAfterStart ? durationEndConstraint : oneYearAfterStart;
                    return (
                        startOfDay(date) > startOfDay(effectiveEndDate) ||
                        startOfDay(date) < startOfDay(formData.durationStart)
                    );
                  }}
                  locale={ko}
                  captionLayout="dropdown"
                  fromYear={2024}
                  toYear={new Date().getFullYear() + 1}
                  defaultMonth={formData.durationStart}          
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        </CardContent>
      </Card>
    </Form>
  );
}
