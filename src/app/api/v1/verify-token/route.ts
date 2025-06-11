// src/app/api/v1/verify-token/route.ts
import { NextResponse, NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from  '../../../../../config'; 
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  console.log('Received Authorization Header:', authHeader); // Debugging line

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ isValid: false, message: 'Invalid Authorization header' }, { status: 401 });
  }

  const token = authHeader.substring(7); // Extract the token after "Bearer "
  console.log('Received token:', token);

  if (!token) {
    return NextResponse.json({ isValid: false, message: 'Token not provided' }, { status: 401 });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set!');
    return NextResponse.json({ isValid: false, message: 'Server error: JWT_SECRET not configured' }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log('Token decoded successfully:', decoded); // Optional: Log decoded payload
    return NextResponse.json({ isValid: true, user: decoded }, { status: 200 });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ isValid: false, message: 'Invalid token' }, { status: 401 });
  }
}