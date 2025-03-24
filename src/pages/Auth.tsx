
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import Layout from '@/components/Layout';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email sign in with:', email, password);
    // Handle email sign in logic here
  };
  
  const handlePhoneSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpSent) {
      console.log('Sending OTP to:', phone);
      setIsOtpSent(true);
    } else {
      console.log('Verifying OTP:', otp, 'for phone:', phone);
      // Handle OTP verification logic here
    }
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Welcome to SpotMe</h1>
          <p className="text-foreground/70">Sign in to access your account and explore local events</p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email" className="flex items-center justify-center">
                <Mail size={16} className="mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center justify-center">
                <Phone size={16} className="mr-2" />
                Phone
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full button-hover">
                  Sign In <ArrowRight size={16} className="ml-2" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="phone">
              <form onSubmit={handlePhoneSignIn} className="space-y-4">
                {!isOtpSent ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP sent to {phone}</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                    />
                  </div>
                )}
                <Button type="submit" className="w-full button-hover">
                  {isOtpSent ? 'Verify OTP' : 'Send OTP'} <ArrowRight size={16} className="ml-2" />
                </Button>
                {isOtpSent && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => setIsOtpSent(false)}
                  >
                    Change phone number
                  </Button>
                )}
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-foreground/70">
              Don't have an account? {" "}
              <Link to="/auth?signup=true" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
            <p className="text-xs text-foreground/60 mt-2">
              By continuing, you agree to SpotMe's Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
            Continue as guest
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Auth;
