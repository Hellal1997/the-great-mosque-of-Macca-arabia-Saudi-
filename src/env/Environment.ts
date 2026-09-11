/**
 * Environment.ts — assembles the whole static scene and its lighting.
 *
 * LIGHTING CHOICE
 *   Late afternoon. A low warm key light gives the Kaaba a long shadow across
 *   the marble, which is what makes the courtyard read as a real space and
 *   gives the crowd something to be grounded against. A hemisphere fill
 *   stands in for the bounce off several hectares of white marble, which in
 *   the real place is the dominant source of light on people's faces.
 *
 * SHADOWS
 *   One directional shadow map covers the central precinct. Its extent is
 *   deliberately tight: a map stretched over the whole 96 m precinct would
 *   have too few texels per metre to resolve anything. The architecture casts;
 *   the crowd does not (see CrowdRenderer for why).
 */

import * as THREE from 'three';
import { GALLERY, MATAF } from '../config/site.ts';
import { createMaterials, type EnvMaterials } from './Materials.ts';
import { buildHijr, buildKaaba, buildMaqam, buildZamzam } from './Kaaba.ts';
import { buildCourtyard, buildGalleries, buildMinarets } from './Precinct.ts';

export type QualityName = 'low' | 'medium' | 'high';

export interface EnvironmentQuality {
  shadows: boolean;
  shadowMapSize: number;
  environmentMap: boolean;
  textureSize: QualityName;
}

export const ENVIRONMENT_QUALITY: Record<QualityName, EnvironmentQuality> = {
  low: { shadows: false, shadowMapSize: 512, environmentMap: false, textureSize: 'low' },
  medium: { shadows: true, shadowMapSize: 1024, environmentMap: true, textureSize: 'medium' },
  high: { shadows: true, shadowMapSize: 2048, environmentMap: true, textureSize: 'high' },
