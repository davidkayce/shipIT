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
import { Agency } from './agency.model';

enum Participants {
  user = User,
  agent = Agent,
  agency = Agency
}

@Controller('participant')
export class ParticipantController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async registerParticipant(
    participant: any,
    @Param(yup.string().oneOf(['user', 'agent', 'agency']))
    type: string
  ) {
    const existing = await Participants[type].getOne(participant.id);
    if (existing.id) throw new Error(`Participant with id ${user.id} has been already registered`);

    participant.identity = this.sender;
    await participant.save();
    this.tx.stub.setEvent('ParticipantRegister', { participant });
  }


  @Invokable()
  public async getParticipantDetails(
    @Param(yup.string())
    id: string,
    @Param(yup.string().oneOf(['user', 'agent', 'agency']))
    type: string
  ) {
    const existing = await Participants[type].getOne(id);
    if (!existing.id) throw new Error(`No ${type} was found with id ${id}`);
    return existing.toJSON() as Participants[type];
  }


  @Invokable()
  public async getAllUsers() {
    return (await User.getAll()).map(p => p.toJSON() as User);
  }

  @Invokable()
  public async getAllAgents() {
    return (await Agent.getAll()).map(p => p.toJSON() as Agent);
  }

  @Invokable()
  public async getAllAgencies() {
    return (await Agency.getAll()).map(p => p.toJSON() as Agency);
  }
}