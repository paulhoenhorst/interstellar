<template>
  <div :class="['camouflage-wrapper', { favorite: isFavorite }]">
    <div
      :class="['camouflage', `camouflage-layout-${layout}`]"
      @click="handleToggleCompleted(camouflage)"
      :content="requirementTooltip(camouflage)"
      v-tippy="{ placement: 'bottom' }">
      <div :class="['inner', this.isCompleted ? 'completed' : '']">
        <img
          :src="`https://emilcarlsson.se/interstellar/camouflages/${convertToKebabCase(
            camouflage.name
          )}.png`"
          :alt="camouflage.name"
          onerror="javascript:this.src='/base-gradient.svg'" />
        <IconComponent class="complete" name="check" fill="#10ac84" size="30" />
        <IconComponent class="remove" name="times" fill="#ee5253" size="30" />
        <div class="info">
          <span class="name">{{ camouflage.name }}</span>
          <span class="requirement">{{ requirementTooltip(camouflage) }}</span>
        </div>
      </div>
    </div>

    <IconComponent
      class="favorite-icon"
      name="star"
      :fill="isFavorite ? '#feca57' : 'gray'"
      icon-style="solid"
      size="25"
      @click="toggleFavorite({ type: 'camouflages', name: camouflage.name })"
      v-tippy="{
        content: $t('filters.toggle_favorite', {
          state: isFavorite ? $t('general.remove_from') : $t('general.add_to'),
        }),
      }" />
  </div>
</template>

<script>
import { useStore } from '@/stores/store'
import { convertToKebabCase } from '@/utils/utils'
import { mapActions, mapState } from 'pinia'

const store = useStore()

export default {
  props: {
    camouflage: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState(useStore, ['camouflageRequirements', 'preferences', 'weapons']),

    layout() {
      return this.preferences.layout
    },

    isCompleted() {
      return this.weapons.find((weapon) => weapon.name === this.weapon)[this.progressType][
        this.camouflage.name
      ]
    },

    isFavorite() {
      return store.isFavorite('camouflages', this.camouflage.name)
    },

    progressType() {
      return this.camouflage.zombies ? 'zombiesProgress' : 'progress'
    },

    weapon() {
      return this.camouflageRequirements[this.camouflage.name].weapon
    },
  },

  methods: {
    convertToKebabCase,
    ...mapActions(useStore, ['toggleCamouflageCompleted', 'toggleFavorite']),

    requirementTooltip(camouflage) {
      const requirement = this.camouflageRequirements[camouflage.name]

      return this.$t('pages.camouflages.requirement_tooltip', {
        weapon: requirement.weapon,
        level: requirement.level,
        challenge: this.translateChallenge(requirement.challenge) || 'TBA',
      })
    },

    handleToggleCompleted(camouflage) {
      const progress = camouflage.zombies ? 'zombies' : 'progress'
      this.toggleCamouflageCompleted(this.weapon, camouflage.name, this.isCompleted, progress)
    },

    translateChallenge(challenge) {
      const { amount, type, seconds, times } = challenge

      if (seconds) {
        return this.$t(`challenges.types.${type}`, { amount, seconds, times })
      } else if (times) {
        return this.$t(`challenges.types.${type}`, { amount, times })
      } else {
        return this.$t(`challenges.types.${type}`, { amount })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.camouflage-wrapper {
  position: relative;

  &.favorite .favorite-icon {
    opacity: 1 !important;
  }

  &:hover {
    .favorite-icon {
      opacity: 1;
    }
  }

  .favorite-icon {
    cursor: pointer;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: $transition;
    transform: translate(50%, -50%);
    z-index: 2;

    @media (max-width: $tablet) {
      opacity: 1 !important;
      transform: translate(50%, -50%) scale(1.25);
    }
  }

  .camouflage {
    user-select: none;

    &.camouflage-layout-grid > .inner {
      flex-direction: column;
      justify-content: center;

      &.completed > .info {
        opacity: 0.5;
      }

      img {
        height: 80px;
        object-fit: cover;
        position: relative;
        width: 100%;
        z-index: 1;
      }

      .icon-component {
        left: 50%;
        opacity: 0;
        position: absolute;
        transform: translate(-50%, -50%);
        transition: $transition;
        top: 35%;
        z-index: 2;
      }

      .info {
        padding: 8px;

        .name {
          font-size: 14px;
        }
      }
    }

    &.camouflage-layout-list > .inner {
      $image-size: 100px;
      background: $elevation-1-color;
      flex-direction: row;

      &.completed > .info {
        opacity: 0.5;
      }

      img {
        height: $image-size;
        position: relative;
        width: $image-size;
        z-index: 1;
      }

      .icon-component {
        left: calc($image-size / 2);
        opacity: 0;
        position: absolute;
        transform: translate(-50%, -50%);
        transition: $transition;
        top: 50%;
        z-index: 2;
      }

      .info {
        padding: 0 20px;
        text-align: left;

        .name {
          font-weight: 500;
        }

        .requirement {
          display: block;
          font-size: 14px;
          line-height: 1.5;
          margin-top: 10px;
        }
      }
    }

    .inner {
      align-items: center;
      background: $elevation-2-color;
      border-radius: $border-radius;
      cursor: pointer;
      display: flex;
      height: 100%;
      overflow: hidden;
      position: relative;
      transition: $transition;
      width: 100%;

      &:hover {
        @media (min-width: $tablet) {
          img,
          p {
            opacity: 0.25;
          }

          .icon-component.complete {
            opacity: 1;
          }
        }
      }

      &.completed {
        &:hover {
          @media (min-width: $tablet) {
            .icon-component.complete {
              opacity: 0;
            }
            .icon-component.remove {
              opacity: 1;
            }
          }
        }

        img,
        p {
          opacity: 0.25;
        }

        .icon-component {
          &.complete {
            opacity: 1;
          }

          &.remove {
            opacity: 0;
          }
        }
      }

      &.disabled {
        cursor: not-allowed;

        &:hover {
          img,
          p {
            opacity: 1;
          }

          .icon-component {
            opacity: 0;
          }
        }
      }

      .info {
        transition: opacity $transition;

        .requirement {
          display: none;
        }
      }

      p {
        font-size: 14px;
      }
    }
  }
}
</style>
