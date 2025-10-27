import bcrypt from 'bcrypt';

import { prisma } from '../src/lib/prisma'; // ajuste o caminho se necessário

async function main() {
  const senha = '313722';
  const senhaHash = await bcrypt.hash(senha, 10);

  await prisma.user.create({
    data: {
      name: 'Novo Usuário',
      email: 'novo@exemplo.com',
      hashedPassword: senhaHash,
      // adicione outros campos obrigatórios do seu schema
    }
  });

  console.log('Usuário criado com senha 313722');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
