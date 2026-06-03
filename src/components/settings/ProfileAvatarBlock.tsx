import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Theme } from '../../tokens';
import { HeadlineText, BodyText, MaterialIcon, ConfigInputField, SecondaryActionButton, PrimaryActionButton, SafeText, LabelCapsText } from '../../atoms';
import { useAuthContext } from '../../context';

const PREBUILT_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/png?seed=Tux',
  'https://api.dicebear.com/7.x/bottts/png?seed=Buster',
  'https://api.dicebear.com/7.x/bottts/png?seed=Rover',
  'https://api.dicebear.com/7.x/bottts/png?seed=Coco',
  'https://api.dicebear.com/7.x/bottts/png?seed=Gizmo',
  'https://api.dicebear.com/7.x/bottts/png?seed=Shadow',
  'https://api.dicebear.com/7.x/bottts/png?seed=Sparky',
  'https://api.dicebear.com/7.x/bottts/png?seed=Rusty',
];

export interface ProfileAvatarBlockProps {
  name: string;
  email: string;
  avatarUrl?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProfileAvatarBlock: React.FC<ProfileAvatarBlockProps> = ({
  name,
  email,
  avatarUrl,
  style,
}) => {
  const { updateUserProfile } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedAvatarUrl, setEditedAvatarUrl] = useState(avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setEditedName(name);
    setEditedAvatarUrl(avatarUrl || '');
  }, [name, avatarUrl]);

  const handlePickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          setErrorMsg(response.errorMessage || 'Image selection error');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            setEditedAvatarUrl(uri);
          }
        }
      }
    );
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      setErrorMsg('Display name is required.');
      return;
    }
    setErrorMsg('');
    setIsSaving(true);
    try {
      await updateUserProfile(editedName.trim(), editedAvatarUrl.trim());
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {isEditing ? (
        <View style={styles.editForm}>
          <LabelCapsText color={Theme.colors.primary.default} style={styles.formTitle}>
            Edit Profile
          </LabelCapsText>
          
          <ConfigInputField
            label="Display Name"
            value={editedName}
            onChangeText={setEditedName}
            placeholder="e.g. Student Name"
          />
          
          <View style={styles.pickerContainer}>
            <LabelCapsText color={Theme.colors.text.secondary} style={styles.fieldLabel}>
              Profile Picture
            </LabelCapsText>
            <View style={styles.pickerRow}>
              <View style={styles.previewContainer}>
                {editedAvatarUrl ? (
                  <Image source={{ uri: editedAvatarUrl }} style={styles.previewImage} />
                ) : (
                  <MaterialIcon name="person" size={24} color={Theme.colors.text.secondary} />
                )}
              </View>
              <SecondaryActionButton
                label="CHOOSE FROM GALLERY"
                onPress={handlePickImage}
                leftIcon={<MaterialIcon name="photo-library" size={18} color={Theme.colors.primary.default} />}
                style={styles.pickerBtn}
              />
            </View>
          </View>

          <View style={styles.prebuiltContainer}>
            <LabelCapsText color={Theme.colors.text.secondary} style={styles.fieldLabel}>
              Prebuilt Options
            </LabelCapsText>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.prebuiltScrollContent}
            >
              {PREBUILT_AVATARS.map((url, index) => {
                const isSelected = editedAvatarUrl === url;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setEditedAvatarUrl(url)}
                    style={[
                      styles.prebuiltAvatarTouch,
                      isSelected && styles.prebuiltAvatarSelected,
                    ]}
                    accessibilityLabel={`Select prebuilt avatar option ${index + 1}`}
                    accessibilityRole="button"
                  >
                    <Image source={{ uri: url }} style={styles.prebuiltAvatarImage} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {!!errorMsg && (
            <SafeText color={Theme.colors.semantic.error} style={styles.errorText}>
              {errorMsg}
            </SafeText>
          )}

          <View style={styles.buttonRow}>
            <SecondaryActionButton
              label="CANCEL"
              onPress={() => {
                setIsEditing(false);
                setEditedName(name);
                setEditedAvatarUrl(avatarUrl || '');
                setErrorMsg('');
              }}
              style={styles.cancelBtn}
            />
            <PrimaryActionButton
              label="SAVE"
              onPress={handleSaveProfile}
              loading={isSaving}
              style={styles.saveBtn}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} accessible={true} accessibilityLabel={`${name}'s Avatar`} />
            ) : (
              <MaterialIcon name="person" size={40} color={Theme.colors.text.secondary} />
            )}
          </View>
          <View style={styles.nameRow}>
            <HeadlineText size={Theme.fontSize.titleMD} weight="bold" color={Theme.colors.text.primary} style={styles.name}>
              {name}
            </HeadlineText>
            <TouchableOpacity 
              onPress={() => setIsEditing(true)} 
              style={styles.editButton}
              accessibilityLabel="Edit profile details"
              accessibilityRole="button"
            >
              <MaterialIcon name="edit" size={16} color={Theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <BodyText size={Theme.fontSize.bodySM} color={Theme.colors.text.secondary}>
            {email}
          </BodyText>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
  },
  avatarContainer: {
    width: Theme.layout.profileAvatarSizeLG,
    height: Theme.layout.profileAvatarSizeLG,
    borderRadius: Theme.borderRadius.full,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    backgroundColor: Theme.colors.surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.noShadow,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.xxs,
  },
  name: {
    marginRight: Theme.spacing.xs,
  },
  editButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editForm: {
    width: '100%',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface.default,
    borderRadius: Theme.borderRadius.default,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  formTitle: {
    marginBottom: Theme.spacing.md,
  },
  errorText: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.fontSize.labelSM,
  },
  pickerContainer: {
    marginTop: Theme.spacing.md,
    width: '100%',
  },
  fieldLabel: {
    marginBottom: Theme.spacing.xs,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  previewContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border.subtle,
    backgroundColor: Theme.colors.surface.raised,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  pickerBtn: {
    flex: 1,
  },
  prebuiltContainer: {
    marginTop: Theme.spacing.md,
    width: '100%',
  },
  prebuiltScrollContent: {
    paddingVertical: Theme.spacing.xs,
    gap: Theme.spacing.sm,
  },
  prebuiltAvatarTouch: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border.subtle,
    backgroundColor: Theme.colors.surface.raised,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  prebuiltAvatarSelected: {
    borderColor: Theme.colors.primary.default,
    borderWidth: 2,
  },
  prebuiltAvatarImage: {
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1,
  },
});