"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle2, XCircle, Brain } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const DeepSeekConfig = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('deepseek_api_key');
    if (saved) {
      setApiKey(saved);
      setIsConfigured(true);
    }
  }, []);

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        localStorage.setItem('deepseek_api_key', apiKey);
        setIsConfigured(true);
        showSuccess('DeepSeek API connected successfully!');
      } else {
        throw new Error('Invalid API key');
      }
    } catch (error) {
      showError('Failed to connect. Please check your API key.');
      setIsConfigured(false);
    } finally {
      setIsTesting(false);
    }
  };

  const clearKey = () => {
    localStorage.removeItem('deepseek_api_key');
    setApiKey('');
    setIsConfigured(false);
    showSuccess('API key removed.');
  };

  return (
    <Card className="border-2 border-indigo-100 dark:border-indigo-900/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg">DeepSeek AI</CardTitle>
          </div>
          <Badge variant={isConfigured ? 'default' : 'secondary'} className={isConfigured ? 'bg-green-100 text-green-700' : ''}>
            {isConfigured ? (
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Connected</span>
            ) : (
              <span className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Not Configured</span>
            )}
          </Badge>
        </div>
        <CardDescription>Configure your DeepSeek API key for AI-powered analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="api-key" className="sr-only">API Key</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="api-key"
                type="password"
                placeholder={isConfigured ? '••••••••••••••••' : 'sk-...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {isConfigured ? (
            <Button variant="outline" onClick={clearKey} className="shrink-0">
              Clear
            </Button>
          ) : (
            <Button onClick={testConnection} disabled={!apiKey || isTesting} className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
              {isTesting ? 'Testing...' : 'Connect'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeepSeekConfig;