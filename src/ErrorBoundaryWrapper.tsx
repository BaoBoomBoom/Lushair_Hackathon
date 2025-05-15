import React from 'react';
import { useHistory } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新state使下一次渲染能够显示降级后的UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error(error, errorInfo);
  }

  componentDidUpdate() {
    if (this.state.hasError) {
      // 如果UI出错，使用react-router进行页面重定向
      this.props.history.push('/welcome');
    }
  }

  render() {
    if (this.state.hasError) {
      // 你同样可以渲染一个降级的UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// 使用useHistory hook在函数组件中获取history对象
function ErrorBoundaryWrapper({ children }) {
  const history = useHistory();
  return <ErrorBoundary history={history}>{children}</ErrorBoundary>;
}

export default ErrorBoundaryWrapper;
