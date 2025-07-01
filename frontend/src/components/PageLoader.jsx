import { Loader2 } from 'lucide-react'
import useThemeStore from '../store/useThemeStore'

const PageLoader = () => {
  const {theme} = useThemeStore();
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
        <Loader2 className='animate-spin size-16 text-primary' strokeWidth={1}/>
    </div>
  )
}

export default PageLoader