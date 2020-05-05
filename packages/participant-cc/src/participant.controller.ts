import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { User } from './user.model';
import { Agent } from './agents.model';

@Controller('participant')
export class ParticipantController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async registerUser(
    @Param(User)
    user: User
  ) {
    const existing = await User.getOne(user.id);
    if (existing.id) {
      throw new Error(`Participant with id ${user.id} has been already registered`);
    }

    user.identity = this.sender;
    await user.save();
    this.tx.stub.setEvent('UserRegister', { user });
  }

  @Invokable()
  public async registerAgent(
    @Param(Agent)
    agent: Agent
  ) {
    const existing = await Agent.getOne(agent.id);
    if (existing.id) {
      throw new Error(`Participant with id ${agent.id} has been already registered`);
    }

    agent.identity = this.sender;
    await agent.save();
    this.tx.stub.setEvent('UserRegister', { agent });
  }


  @Invokable()
  public async getUserDetails(
    @Param(yup.string())
    id: string
  ) {
    const existing = await User.getOne(id);
    if (!existing.id) {
      throw new Error(`No producer was found with id ${id}`);
    }

    return existing.toJSON() as User;
  }

  @Invokable()
  public async getAgentDetails(
    @Param(yup.string())
    id: string
  ) {
    const existing = await Agent.getOne(id);
    if (!existing.id) {
      throw new Error(`No producer was found with id ${id}`);
    }

    return existing.toJSON() as Agent;
  }


  @Invokable()
  public async getAllUsers() {
    return (await User.getAll()).map(p => p.toJSON() as User);
  }

  @Invokable()
  public async getAllAgents() {
    return (await Agent.getAll()).map(p => p.toJSON() as Agent);
  }
}