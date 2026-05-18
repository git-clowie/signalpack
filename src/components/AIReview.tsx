import React from 'react';
import { Card, Button, Badge } from '@/src/components/ui';
import { AlertTriangle, ArrowRight, CheckCircle2, CircleHelp, MessageSquareMore, ShieldAlert, Users, Zap } from 'lucide-react';
import { DraftReport } from '@/src/types';
import { AnalysisLoading, AnalysisMetric, QuestionRow, QuickAnswer } from './AIReviewParts';

export function AIReviewScreen({
  report,
  onNext,
  onInlineComplete,
}: {
  report: DraftReport;
  onNext: () => void;
  onInlineComplete?: (answers: string[]) => Promise<void>;
}) {
  const isAnalyzing = !report.packet;
  const providerLabel = report.packet?.model_provider === 'openrouter'
    ? 'OpenRouter'
    : report.packet?.model_provider === 'fallback'
      ? 'Safety Fallback'
      : 'SignalPack Core';
  const modelName = report.packet?.model_name || 'Gemma 4';
  const fallbackUsed = !!report.packet?.fallback_used;
  const questions = report.clarificationQuestions || [];
  const [answers, setAnswers] = React.useState<Record<number, QuickAnswer>>({});
  const [isContinuing, setIsContinuing] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('AI thinking...');
  const loadingBars = [12, 24, 16, 28, 20, 14, 26];

  React.useEffect(() => {
    if (!isAnalyzing) return;
    const stages = [
      'Extracting signal...',
      'Detecting hazards...',
      'Checking uncertainty...',
      'Preparing questions...',
      'Building safety vector...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(stages[i % stages.length]);
      i++;
    }, 1400);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const setQuickAnswer = (index: number, answer: QuickAnswer) => {
    setAnswers((current) => ({ ...current, [index]: answer }));
  };

  const allQuestionsAnswered = questions.length > 0 && questions.every((_, index) => answers[index]);

  const handleContinue = async () => {
    if (questions.length > 0 && allQuestionsAnswered && onInlineComplete) {
      setIsContinuing(true);
      await onInlineComplete(questions.map((_, index) => answers[index]));
      return;
    }
    onNext();
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col px-4 pb-6 pt-4 md:px-6 lg:px-8">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Gemma 4 Analysis</h1>
            {!isAnalyzing && <Badge variant="blue">Understand</Badge>}
          </div>
          <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-slate">
            {isAnalyzing ? 'AI analysis & clarification' : `${providerLabel} / ${modelName}`}
          </p>
        </div>
        {!isAnalyzing && fallbackUsed && (
          <Badge variant="warning" className="shrink-0">Fallback</Badge>
        )}
      </div>

      {isAnalyzing ? (
        <AnalysisLoading loadingBars={loadingBars} loadingText={loadingText} />
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {report.image && (
            <Card className="overflow-hidden border-mist/50 bg-surface/30">
              <img src={report.image} alt="Incident" className="h-36 w-full object-cover opacity-90 sm:h-48" />
            </Card>
          )}

          {fallbackUsed && (
            <Card className="rounded-xl border-warning/30 bg-warning/10 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-warning">
                <AlertTriangle className="h-4 w-4" /> Fallback Mode
              </h3>
              <p className="text-xs leading-relaxed text-slate">
                The configured Gemma 4 route was unavailable, so SignalPack used marked safety rules. Review carefully or retry from Settings.
              </p>
            </Card>
          )}

          <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="rounded-2xl border-mist/50 bg-surface/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate">Signal Summary</h2>
              <div className="space-y-3">
                <AnalysisMetric
                  icon={ShieldAlert}
                  label="Incident Type"
                  title={formatIncident(report.packet?.incident_type)}
                  caption={fallbackUsed ? 'Needs review' : 'High confidence'}
                  tone="blue"
                />
                <AnalysisMetric
                  icon={Users}
                  label="People at Risk"
                  title={formatPeopleAtRisk(report)}
                  caption={report.packet?.people_at_risk_count ? 'Reported by user/context' : 'Needs confirmation'}
                  tone="cyan"
                />
                <AnalysisMetric
                  icon={CircleHelp}
                  label="Uncertainty"
                  title={uncertaintyLabel(report.packet?.uncertainties?.length || 0)}
                  caption={report.packet?.uncertainties?.[0] || 'No major uncertainty detected yet'}
                  tone="warning"
                  meter={uncertaintyMeter(report.packet?.uncertainties?.length || 0)}
                />
              </div>
            </Card>

            <Card className="rounded-2xl border-mist/50 bg-surface/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <h2 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate">
                <AlertTriangle className="h-4 w-4 text-warning" /> Detected Hazards
              </h2>
              {report.packet?.hazards?.length ? (
                <div className="flex flex-wrap gap-2">
                  {report.packet.hazards.map((hazard, index) => (
                    <span
                      key={`${hazard}-${index}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-warning/25 bg-warning/10 px-3 py-2 text-xs font-semibold text-warning"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      {hazard}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-mist/35 bg-cloud/60 px-3 py-3 text-sm text-slate">No hazards extracted yet.</p>
              )}
            </Card>
          </div>

          <Card className="rounded-2xl border-mist/50 bg-surface/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate">Clarification Questions</h2>
                <p className="mt-1 text-xs text-slate/80">Answer what you can. Unsure is valid.</p>
              </div>
              {questions.length > 0 && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-brand">
                  {Object.keys(answers).length}/{questions.length}
                </span>
              )}
            </div>

            {questions.length > 0 ? (
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <QuestionRow
                    key={`${question}-${index}`}
                    question={question}
                    answer={answers[index]}
                    onAnswer={(answer) => setQuickAnswer(index, answer)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success/5 p-3 text-sm text-success">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Gemma has enough information to draft the Crisis Packet.
              </div>
            )}
          </Card>
        </div>
      )}

      {!isAnalyzing && (
        <div className="mt-auto border-t border-mist/50 pt-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-slate">
              {questions.length > 0
                ? allQuestionsAnswered
                  ? 'Answers captured. Continue to generate the final Crisis Packet.'
                  : 'You can answer inline or continue to the guided chat.'
                : 'Review the detected details, then finalize the packet.'}
            </p>
            {questions.length > 0 && !allQuestionsAnswered && (
              <button onClick={onNext} className="inline-flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyan-brand hover:text-white">
                <MessageSquareMore className="h-4 w-4" />
                Guided chat
              </button>
            )}
          </div>
          <Button size="lg" fullWidth onClick={handleContinue} disabled={isContinuing}>
            {isContinuing ? 'Building Packet...' : allQuestionsAnswered ? 'Update & Continue' : questions.length ? 'Clarify Details' : 'Finalize Packet'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function formatIncident(value?: string) {
  if (!value) return 'Unclassified';
  if (value === 'blocked_access') return 'Blocked Road / Obstruction';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPeopleAtRisk(report: DraftReport) {
  const count = report.packet?.people_at_risk_count;
  if (count && count > 0) return `${count} reported`;
  return 'Unknown / needs confirmation';
}

function uncertaintyLabel(count: number) {
  if (count >= 4) return 'High';
  if (count >= 2) return 'Medium';
  if (count === 1) return 'Low';
  return 'Low';
}

function uncertaintyMeter(count: number) {
  if (count >= 4) return 5;
  if (count >= 2) return 3;
  if (count === 1) return 2;
  return 1;
}
