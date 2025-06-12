import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Container } from './container'
import { Stack } from './stack'
import { Button } from './button'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Container>
            <div className="max-w-md mx-auto text-center">
              <Stack spacing="lg">
                <div className="text-red-500">
                  <AlertTriangle size={64} className="mx-auto" />
                </div>
                
                <Stack spacing="sm">
                  <h1 className="text-2xl font-bold text-slate-900">
                    Something went wrong
                  </h1>
                  <p className="text-slate-600">
                    We&apos;re sorry, but something unexpected happened. Please try reloading the page.
                  </p>
                </Stack>

                <div className="flex justify-center">
                  <Button onClick={this.handleReload}>
                    <RefreshCw size={16} />
                    Reload page
                  </Button>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left text-sm bg-red-50 border border-red-200 rounded p-4">
                    <summary className="font-medium text-red-800 cursor-pointer">
                      Error details
                    </summary>
                    <pre className="mt-2 text-red-700 whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                    </pre>
                  </details>
                )}
              </Stack>
            </div>
          </Container>
        </div>
      )
    }

    return this.props.children
  }
}