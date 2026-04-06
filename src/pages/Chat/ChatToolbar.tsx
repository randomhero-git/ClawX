/**
 * Chat Toolbar
 * Session selector, new session, refresh, and thinking toggle.
 * Rendered in the Header when on the Chat page.
 */
import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useChatStore } from '@/stores/chat';
import { useAgentsStore } from '@/stores/agents';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function ChatToolbar() {
  const refresh = useChatStore((s) => s.refresh);
  const loading = useChatStore((s) => s.loading);
  const showThinking = useChatStore((s) => s.showThinking);
  const toggleThinking = useChatStore((s) => s.toggleThinking);
  const currentAgentId = useChatStore((s) => s.currentAgentId);
  const agents = useAgentsStore((s) => s.agents);
  const { t } = useTranslation('chat');
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') ?? 'hero');
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(root.getAttribute('data-theme') ?? 'hero');
    });
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  const currentAgentName = useMemo(
    () => (agents ?? []).find((agent) => agent.id === currentAgentId)?.name ?? currentAgentId,
    [agents, currentAgentId],
  );

  const personaImg = (path: string) => {
    const base = window.electron.resourcesPath;
    return base
      ? `clawx-asset://resources/personas/${path}`
      : `/resources/personas/${path}`;
  };

  return (
    <div className="flex items-center gap-2 w-full justify-center">
      <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/70 px-2.5 py-1 text-[13px] font-bold italic text-primary-foreground">
        <img
          src={personaImg(theme === 'hero' ? 'hero/icon.png' : 'zero/icon.png')}
          alt={theme === 'hero' ? 'Hero' : 'Zero'}
          className="h-5 w-5 rounded-full object-cover shrink-0"
        />
        <span>{t('toolbar.currentAgent', { agent: currentAgentName })}</span>
      </div>
      <div className="absolute left-4 flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary"
              onClick={() => refresh()}
              disabled={loading}
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('toolbar.refresh')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="absolute right-4 flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8',
                showThinking && 'bg-primary/10 text-primary',
              )}
              onClick={toggleThinking}
            >
              <Brain className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showThinking ? t('toolbar.hideThinking') : t('toolbar.showThinking')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
