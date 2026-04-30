'use client';

import { Alert, Button, Stack } from '@mui/material';
import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export class ComponentErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // Intentionally silent in UI; production apps should report this to telemetry.
  }

  private readonly resetBoundary = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Stack spacing={2}>
          <Alert severity="error">{this.props.fallbackMessage ?? 'Something went wrong.'}</Alert>
          <Button onClick={this.resetBoundary} variant="outlined">
            Retry Section
          </Button>
        </Stack>
      );
    }

    return this.props.children;
  }
}
