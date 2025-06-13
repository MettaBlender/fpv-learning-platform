import React, {useState} from 'react'
import { Form, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Eye, EyeClosed } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

const Login = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const handleLogin = async (e) => {
    e.preventDefault()
    if (username === '' || password === '') {
      alert('Bitte fülle alle Felder aus.')
      return
    }
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const session = data.session
      sessionStorage.setItem('session', session)
      toast.success('Login erfolgreich!');
      localStorage.setItem('selectedTab', "goggles")
      window.location.reload()
    } else {
      const errorData = await response.json()
      toast.error(`Fehler: ${errorData.message || 'Unbekannter Fehler'}`);
    }
  }

  return (
    <div className='w-full h-full px-[35%] mt-24'>
      <form className='w-full' onSubmit={handleLogin}>
        <h1 className='text-4xl font-bold text-white'>Login</h1>
        <div className='my-2'>
          <Label className='text-white'>Benutzername:</Label>
          <Input required onChange={(e) => setUsername(e.target.value)}/>
          { username === '' && (<p className='text-[#d9534f]'>Bitte geben sie einen Benutzernamen ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Passwort:</Label>
          <Input type={showPassword ? 'text' : 'password'} required onChange={(e) => setPassword(e.target.value)}/>
          { password === '' && (<p className='text-[#d9534f]'>Bitte geben sie ein Passwort ein</p>) }
          <Eye className={` ${showPassword ? 'hidden' : ''} absolute top-8 right-2.5 text-[#aebbc4] hover:text-gray-600`} onClick={() => setShowPassword(true)}/>
          <EyeClosed className={`${showPassword ? '' : 'hidden'} absolute top-8 right-2.5 text-[#aebbc4] hover:text-gray-600`} onClick={() => setShowPassword(false)}/>
        </div>
        <Button className='w-full mt-4' type='submit'>Login</Button>
      </form>
    </div>
  )
}

export default Login