"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type AnamnesisQuestion = {
  id: string;
  question: string;
  type: "TEXT" | "BOOLEAN" | "MULTIPLE_CHOICE" | "NUMBER";
  helperText?: string | null;
  options?: string[];
};

type AnswerPayload = {
  questionId: string;
  valueText?: string;
  valueBoolean?: boolean;
  valueNumber?: number;
  valueOptions?: string[];
};

type Props = {
  questions: AnamnesisQuestion[];
  name?: string;
};

export function AnamnesisQuestionList({ questions, name = "answers" }: Props) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerPayload>>(() => ({}));

  const questionsMap = useMemo(() => {
    const map: Record<string, AnswerPayload> = {};
    questions.forEach((question) => {
      map[question.id] = { questionId: question.id };
    });
    return map;
  }, [questions]);

  useEffect(() => {
    setAnswers(questionsMap);
  }, [questionsMap]);

  useEffect(() => {
    if (hiddenRef.current) {
      hiddenRef.current.value = JSON.stringify(Object.values(answers));
    }
  }, [answers]);

  function updateAnswer(questionId: string, value: Partial<AnswerPayload>) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] ?? { questionId }),
        ...value,
        questionId,
      },
    }));
  }

  return (
    <div className="space-y-6">
      <input ref={hiddenRef} type="hidden" name={name} />
      {questions.map((question, index) => (
        <div key={question.id} className="rounded-2xl border border-white/10 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {index + 1}. {question.question}
              </p>
              {question.helperText ? (
                <p className="text-xs text-slate-500">{question.helperText}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {question.type === "TEXT" ? (
              <Textarea
                rows={4}
                placeholder="Descreva a resposta"
                onChange={(event) => updateAnswer(question.id, { valueText: event.target.value })}
              />
            ) : null}

            {question.type === "BOOLEAN" ? (
              <div className="flex gap-3">
                {[
                  { label: "Sim", value: true },
                  { label: "Não", value: false },
                  { label: "Não sei", value: undefined },
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => updateAnswer(question.id, { valueBoolean: option.value })}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition",
                      answers[question.id]?.valueBoolean === option.value
                        ? "border-primary bg-primary/20 text-white"
                        : "border-white/12 text-white/70 hover:border-white/20 hover:text-white",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}

            {question.type === "NUMBER" ? (
              <Input
                type="number"
                step="0.1"
                placeholder="Informe o valor"
                onChange={(event) =>
                  updateAnswer(question.id, { valueNumber: Number(event.target.value) })
                }
              />
            ) : null}

            {question.type === "MULTIPLE_CHOICE" ? (
              <Select
                multiple
                onChange={(event) =>
                  updateAnswer(question.id, {
                    valueOptions: Array.from(event.target.selectedOptions).map((option) => option.value),
                  })
                }
              >
                <option value="" disabled>
                  Selecione as opções
                </option>
                {(question.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

