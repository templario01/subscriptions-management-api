import { Platform, PrismaClient, Role, User } from '@prisma/client'
import { RolesEnum } from '../src/application/common/roles.enum'
import { hash } from 'bcrypt'
import { PlatformsEnum } from '../src/application/common/platforms.enum'

const prisma = new PrismaClient()

async function main() {
  console.log('sedding data...')
  const roles = await createRoles()
  const superAdmin = await createTestSuperAdmin()
  const admin = await createTestAdmin()
  const user = await createTestUser()
  const platforms = await createPlatforms()
  console.log({ roles, superAdmin, admin, user, platforms })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })

async function createTestUser() {
  const username = 'user@example.com'
  const phone = '950354371'
  const password = 'user'
  const roles = [RolesEnum.USER]
  return await createUser(username, phone, password, roles)
}

async function createTestAdmin() {
  const username = 'admin@example.com'
  const phone = '950354373'
  const password = 'admin'
  const roles = [RolesEnum.ADMIN, RolesEnum.USER]
  return await createUser(username, phone, password, roles)
}

async function createTestSuperAdmin() {
  const username = 'superadmin@example.com'
  const phone = '950354372'
  const password = 'superadmin'
  const roles = [RolesEnum.SUPERADMIN, RolesEnum.ADMIN, RolesEnum.USER]
  return await createUser(username, phone, password, roles)
}

async function createRoles(): Promise<Role[]> {
  const roles = [RolesEnum.SUPERADMIN, RolesEnum.ADMIN, RolesEnum.USER]
  const roleTasks = roles.map((role) => {
    return prisma.role.upsert({
      where: { name: role },
      create: { name: role },
      update: { name: role },
    })
  })
  return Promise.all(roleTasks)
}

async function createUser(username: string, phone: string, password: string, roles: RolesEnum[]): Promise<User> {
  const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS)
  const passwordHash = await hash(password, saltRounds)
  return prisma.user.upsert({
    where: { username },
    create: {
      password: passwordHash,
      username,
      phone,
      roles: { connect: roles.map((role) => ({ name: role })) },
    },
    update: {
      username,
      phone,
      password: passwordHash,
      roles: { connect: roles.map((role) => ({ name: role })) },
    },
    include: { roles: true },
  })
}

async function createPlatforms(): Promise<Platform[]> {
  const keys = Object.keys(PlatformsEnum).filter((v) => isNaN(Number(v)))
  const platformTasks = keys.map((key) => {
    return prisma.platform.upsert({
      where: { name: key },
      create: { name: key },
      update: { name: key },
    })
  })

  return Promise.all(platformTasks)
}
