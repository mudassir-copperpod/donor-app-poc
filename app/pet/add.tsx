import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormSelect, SelectOption } from '@/components/forms/FormSelect';
import { FormDatePicker } from '@/components/forms/FormDatePicker';
import { FormImagePicker } from '@/components/forms/FormImagePicker';
import { usePets } from '@/hooks/usePets';
import { useAuth } from '@/hooks/useAuth';
import { Species, Sex, BloodType, EligibilityStatus } from '@/types/pet.types';

interface PetFormData {
  name: string;
  species: Species | '';
  breed: string;
  dateOfBirth: Date;
  sex: Sex | '';
  weight: string;
  color: string;
  markings: string;
  microchipNumber: string;
  photoUrl: string;
  bloodType: BloodType | '';
}

const STEPS = ['Basic Info', 'Physical Details', 'Review'];

export default function AddPetScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addPet, isLoading } = usePets();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: '',
    breed: '',
    dateOfBirth: new Date(),
    sex: '',
    weight: '',
    color: '',
    markings: '',
    microchipNumber: '',
    photoUrl: '',
    bloodType: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PetFormData, string>>>({});

  const speciesOptions: SelectOption[] = [
    { label: 'Dog', value: Species.DOG },
    { label: 'Cat', value: Species.CAT },
    { label: 'Horse', value: Species.HORSE },
    { label: 'Rabbit', value: Species.RABBIT },
    { label: 'Ferret', value: Species.FERRET },
    { label: 'Goat', value: Species.GOAT },
    { label: 'Sheep', value: Species.SHEEP },
    { label: 'Pig', value: Species.PIG },
    { label: 'Cow', value: Species.COW },
    { label: 'Llama', value: Species.LLAMA },
    { label: 'Alpaca', value: Species.ALPACA },
  ];

  const sexOptions: SelectOption[] = [
    { label: 'Male', value: Sex.MALE },
    { label: 'Neutered Male', value: Sex.NEUTERED_MALE },
    { label: 'Female', value: Sex.FEMALE },
    { label: 'Spayed Female', value: Sex.SPAYED_FEMALE },
  ];

  const dogBreeds: SelectOption[] = [
    { label: 'Labrador Retriever', value: 'Labrador Retriever' },
    { label: 'German Shepherd', value: 'German Shepherd' },
    { label: 'Golden Retriever', value: 'Golden Retriever' },
    { label: 'French Bulldog', value: 'French Bulldog' },
    { label: 'Bulldog', value: 'Bulldog' },
    { label: 'Poodle', value: 'Poodle' },
    { label: 'Beagle', value: 'Beagle' },
    { label: 'Rottweiler', value: 'Rottweiler' },
    { label: 'German Shorthaired Pointer', value: 'German Shorthaired Pointer' },
    { label: 'Dachshund', value: 'Dachshund' },
    { label: 'Pembroke Welsh Corgi', value: 'Pembroke Welsh Corgi' },
    { label: 'Australian Shepherd', value: 'Australian Shepherd' },
    { label: 'Yorkshire Terrier', value: 'Yorkshire Terrier' },
    { label: 'Boxer', value: 'Boxer' },
    { label: 'Great Dane', value: 'Great Dane' },
    { label: 'Siberian Husky', value: 'Siberian Husky' },
    { label: 'Doberman Pinscher', value: 'Doberman Pinscher' },
    { label: 'Shih Tzu', value: 'Shih Tzu' },
    { label: 'Boston Terrier', value: 'Boston Terrier' },
    { label: 'Bernese Mountain Dog', value: 'Bernese Mountain Dog' },
    { label: 'Pomeranian', value: 'Pomeranian' },
    { label: 'Mixed Breed', value: 'Mixed Breed' },
    { label: 'Other', value: 'Other' },
  ];

  const catBreeds: SelectOption[] = [
    { label: 'Domestic Shorthair', value: 'Domestic Shorthair' },
    { label: 'Domestic Longhair', value: 'Domestic Longhair' },
    { label: 'Persian', value: 'Persian' },
    { label: 'Maine Coon', value: 'Maine Coon' },
    { label: 'Siamese', value: 'Siamese' },
    { label: 'Ragdoll', value: 'Ragdoll' },
    { label: 'Bengal', value: 'Bengal' },
    { label: 'British Shorthair', value: 'British Shorthair' },
    { label: 'Abyssinian', value: 'Abyssinian' },
    { label: 'Scottish Fold', value: 'Scottish Fold' },
    { label: 'Sphynx', value: 'Sphynx' },
    { label: 'Russian Blue', value: 'Russian Blue' },
    { label: 'American Shorthair', value: 'American Shorthair' },
    { label: 'Birman', value: 'Birman' },
    { label: 'Oriental', value: 'Oriental' },
    { label: 'Devon Rex', value: 'Devon Rex' },
    { label: 'Himalayan', value: 'Himalayan' },
    { label: 'Mixed Breed', value: 'Mixed Breed' },
    { label: 'Other', value: 'Other' },
  ];

  const horseBreeds: SelectOption[] = [
    { label: 'Thoroughbred', value: 'Thoroughbred' },
    { label: 'Quarter Horse', value: 'Quarter Horse' },
    { label: 'Arabian', value: 'Arabian' },
    { label: 'Paint Horse', value: 'Paint Horse' },
    { label: 'Appaloosa', value: 'Appaloosa' },
    { label: 'Tennessee Walking Horse', value: 'Tennessee Walking Horse' },
    { label: 'Morgan', value: 'Morgan' },
    { label: 'Standardbred', value: 'Standardbred' },
    { label: 'Warmblood', value: 'Warmblood' },
    { label: 'Andalusian', value: 'Andalusian' },
    { label: 'Friesian', value: 'Friesian' },
    { label: 'Mustang', value: 'Mustang' },
    { label: 'Clydesdale', value: 'Clydesdale' },
    { label: 'Percheron', value: 'Percheron' },
    { label: 'Belgian', value: 'Belgian' },
    { label: 'Shetland Pony', value: 'Shetland Pony' },
    { label: 'Welsh Pony', value: 'Welsh Pony' },
    { label: 'Mixed Breed', value: 'Mixed Breed' },
    { label: 'Other', value: 'Other' },
  ];

  const rabbitBreeds: SelectOption[] = [
    { label: 'Flemish Giant', value: 'Flemish Giant' },
    { label: 'New Zealand', value: 'New Zealand' },
    { label: 'Californian', value: 'Californian' },
    { label: 'French Lop', value: 'French Lop' },
    { label: 'English Lop', value: 'English Lop' },
    { label: 'Giant Chinchilla', value: 'Giant Chinchilla' },
    { label: 'Checkered Giant', value: 'Checkered Giant' },
    { label: 'Mixed Breed', value: 'Mixed Breed' },
    { label: 'Other', value: 'Other' },
  ];

  const ferretBreeds: SelectOption[] = [
    { label: 'Standard', value: 'Standard' },
    { label: 'Angora', value: 'Angora' },
    { label: 'Other', value: 'Other' },
  ];

  const goatBreeds: SelectOption[] = [
    { label: 'Boer', value: 'Boer' },
    { label: 'Nubian', value: 'Nubian' },
    { label: 'Saanen', value: 'Saanen' },
    { label: 'Alpine', value: 'Alpine' },
    { label: 'LaMancha', value: 'LaMancha' },
    { label: 'Toggenburg', value: 'Toggenburg' },
    { label: 'Nigerian Dwarf', value: 'Nigerian Dwarf' },
    { label: 'Pygmy', value: 'Pygmy' },
    { label: 'Mixed Breed', value: 'Mixed Breed' },
    { label: 'Other', value: 'Other' },
  ];

  const sheepBreeds: SelectOption[] = [
    { label: 'Suffolk', value: 'Suffolk' },
    { label: 'Dorset', value: 'Dorset' },
    { label: 'Hampshire', value: 'Hampshire' },
    { label: 'Merino', value: 'Merino' },
    { label: 'Rambouillet', value: 'Rambouillet' },
    { label: 'Katahdin', value: 'Katahdin' },
    { label: 'Texel', value: 'Texel' },
    { label: 'Mixed Breed', value: 'Mixed Breed' },
    { label: 'Other', value: 'Other' },
  ];

  const pigBreeds: SelectOption[] = [
    { label: 'Yorkshire', value: 'Yorkshire' },
    { label: 'Landrace', value: 'Landrace' },
    { label: 'Duroc', value: 'Duroc' },
    { label: 'Hampshire', value: 'Hampshire' },
    { label: 'Berkshire', value: 'Berkshire' },
    { label: 'Pot-Bellied', value: 'Pot-Bellied' },
    { label: 'Mixed Breed', value: 'Mixed Breed' },
    { label: 'Other', value: 'Other' },
  ];

  const cowBreeds: SelectOption[] = [
    { label: 'Holstein', value: 'Holstein' },
    { label: 'Jersey', value: 'Jersey' },
    { label: 'Angus', value: 'Angus' },
    { label: 'Hereford', value: 'Hereford' },
    { label: 'Guernsey', value: 'Guernsey' },
    { label: 'Brown Swiss', value: 'Brown Swiss' },
    { label: 'Ayrshire', value: 'Ayrshire' },
    { label: 'Mixed Breed', value: 'Mixed Breed' },
    { label: 'Other', value: 'Other' },
  ];

  const llamaBreeds: SelectOption[] = [
    { label: 'Classic', value: 'Classic' },
    { label: 'Woolly', value: 'Woolly' },
    { label: 'Suri', value: 'Suri' },
    { label: 'Mixed', value: 'Mixed' },
    { label: 'Other', value: 'Other' },
  ];

  const alpacaBreeds: SelectOption[] = [
    { label: 'Huacaya', value: 'Huacaya' },
    { label: 'Suri', value: 'Suri' },
    { label: 'Mixed', value: 'Mixed' },
    { label: 'Other', value: 'Other' },
  ];

  const bloodTypeOptions: SelectOption[] = [
    { label: 'Unknown', value: BloodType.UNKNOWN },
    // Dogs
    { label: 'Dog DEA 1.1 Positive', value: BloodType.DOG_DEA_1_1_POSITIVE },
    { label: 'Dog DEA 1.1 Negative', value: BloodType.DOG_DEA_1_1_NEGATIVE },
    { label: 'Dog Universal Donor', value: BloodType.DOG_UNIVERSAL_DONOR },
    // Cats
    { label: 'Cat Type A', value: BloodType.CAT_TYPE_A },
    { label: 'Cat Type B', value: BloodType.CAT_TYPE_B },
    { label: 'Cat Type AB', value: BloodType.CAT_TYPE_AB },
    // Horses
    { label: 'Horse AA Positive', value: BloodType.HORSE_AA_POSITIVE },
    { label: 'Horse QA Positive', value: BloodType.HORSE_QA_POSITIVE },
    // Rabbits
    { label: 'Rabbit Universal', value: BloodType.RABBIT_UNIVERSAL },
    // Ferrets
    { label: 'Ferret Universal', value: BloodType.FERRET_UNIVERSAL },
    // Goats
    { label: 'Goat Type A', value: BloodType.GOAT_TYPE_A },
    { label: 'Goat Type B', value: BloodType.GOAT_TYPE_B },
    // Sheep
    { label: 'Sheep Type A', value: BloodType.SHEEP_TYPE_A },
    { label: 'Sheep Type B', value: BloodType.SHEEP_TYPE_B },
    // Pigs
    { label: 'Pig Universal', value: BloodType.PIG_UNIVERSAL },
    // Cows
    { label: 'Cow Type A', value: BloodType.COW_TYPE_A },
    { label: 'Cow Type B', value: BloodType.COW_TYPE_B },
    { label: 'Cow Type AB', value: BloodType.COW_TYPE_AB },
    // Llamas & Alpacas
    { label: 'Camelid Universal', value: BloodType.CAMELID_UNIVERSAL },
  ];

  const getBreedOptions = (): SelectOption[] => {
    switch (formData.species) {
      case Species.DOG:
        return dogBreeds;
      case Species.CAT:
        return catBreeds;
      case Species.HORSE:
        return horseBreeds;
      case Species.RABBIT:
        return rabbitBreeds;
      case Species.FERRET:
        return ferretBreeds;
      case Species.GOAT:
        return goatBreeds;
      case Species.SHEEP:
        return sheepBreeds;
      case Species.PIG:
        return pigBreeds;
      case Species.COW:
        return cowBreeds;
      case Species.LLAMA:
        return llamaBreeds;
      case Species.ALPACA:
        return alpacaBreeds;
      default:
        return [];
    }
  };

  const updateField = (field: keyof PetFormData, value: any) => {
    const updates: Partial<PetFormData> = { [field]: value };
    
    // Reset breed when species changes
    if (field === 'species') {
      updates.breed = '';
    }
    
    setFormData({ ...formData, ...updates });
    setErrors({ ...errors, [field]: undefined });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof PetFormData, string>> = {};

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.species) newErrors.species = 'Species is required';
      if (!formData.breed.trim()) newErrors.breed = 'Breed is required';
      if (!formData.sex) newErrors.sex = 'Sex is required';
    } else if (step === 1) {
      if (!formData.weight || parseFloat(formData.weight) <= 0) {
        newErrors.weight = 'Valid weight is required';
      }
      if (!formData.color.trim()) newErrors.color = 'Color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a pet');
      return;
    }

    try {
      const age = new Date().getFullYear() - formData.dateOfBirth.getFullYear();
      
      await addPet({
        ownerId: user.userId,
        name: formData.name,
        species: formData.species as Species,
        breed: formData.breed,
        dateOfBirth: formData.dateOfBirth.toISOString(),
        age,
        sex: formData.sex as Sex,
        weightHistory: [{
          weight: parseFloat(formData.weight),
          unit: 'lbs',
          date: new Date().toISOString(),
        }],
        currentWeight: parseFloat(formData.weight),
        color: formData.color,
        markings: formData.markings,
        microchipNumber: formData.microchipNumber,
        photoUrl: formData.photoUrl || 'https://via.placeholder.com/150',
        veterinarianInfo: {
          veterinarianName: '',
          clinicName: '',
          clinicPhone: '',
          clinicEmail: '',
          permissionToContact: false,
        },
        bloodType: (formData.bloodType as BloodType) || BloodType.UNKNOWN,
        eligibilityStatus: EligibilityStatus.PENDING_REVIEW,
      });

      Alert.alert('Success', 'Pet added successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add pet. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderPhysicalDetails();
      case 2:
        return renderReview();
      default:
        return null;
    }
  };

  const renderBasicInfo = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Basic Information</Text>
        <Text style={styles.stepDescription}>
          Let's start with the essential details about your pet
        </Text>
      </View>
      
      <View style={styles.formSection}>
        <Input
          label="Pet Name"
          placeholder="Enter pet's name"
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
          error={errors.name}
          required
        />

        <FormSelect
          label="Species"
          value={formData.species}
          options={speciesOptions}
          onSelect={(value) => updateField('species', value)}
          error={errors.species}
          required
        />

        {formData.species && (
          <FormSelect
            label="Breed"
            value={formData.breed}
            options={getBreedOptions()}
            onSelect={(value) => updateField('breed', value)}
            error={errors.breed}
            placeholder="Select breed"
            required
          />
        )}

        <FormDatePicker
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(date) => updateField('dateOfBirth', date)}
          mode="date"
          maximumDate={new Date()}
          required
        />

        <FormSelect
          label="Sex"
          value={formData.sex}
          options={sexOptions}
          onSelect={(value) => updateField('sex', value)}
          error={errors.sex}
          required
        />
      </View>
    </View>
  );

  const renderPhysicalDetails = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Physical Details</Text>
        <Text style={styles.stepDescription}>
          Help us identify your pet with physical characteristics
        </Text>
      </View>

      <View style={styles.formSection}>
        <FormImagePicker
          label="Pet Photo"
          value={formData.photoUrl}
          onChange={(uri) => updateField('photoUrl', uri)}
          placeholder="Add a photo of your pet"
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 A clear photo helps staff identify your pet during visits
          </Text>
        </View>

        <Input
          label="Weight (lbs)"
          placeholder="Enter weight"
          value={formData.weight}
          onChangeText={(text) => updateField('weight', text)}
          keyboardType="decimal-pad"
          error={errors.weight}
          required
        />

        <Input
          label="Color"
          placeholder="Enter primary color"
          value={formData.color}
          onChangeText={(text) => updateField('color', text)}
          error={errors.color}
          required
        />

        <Input
          label="Markings"
          placeholder="Describe any distinctive markings"
          value={formData.markings}
          onChangeText={(text) => updateField('markings', text)}
          multiline
          numberOfLines={3}
        />

        <Input
          label="Microchip Number"
          placeholder="Enter microchip number (optional)"
          value={formData.microchipNumber}
          onChangeText={(text) => updateField('microchipNumber', text)}
        />

        <FormSelect
          label="Blood Type"
          value={formData.bloodType}
          options={bloodTypeOptions}
          onSelect={(value) => updateField('bloodType', value)}
          placeholder="Select if known"
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ Blood type can be determined during your pet's first donation visit
          </Text>
        </View>
      </View>
    </View>
  );


  const renderReview = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Review & Submit</Text>
        <Text style={styles.stepDescription}>
          Please review your pet's information before submitting
        </Text>
      </View>

      {formData.photoUrl && (
        <View style={styles.reviewPhotoContainer}>
          <Image source={{ uri: formData.photoUrl }} style={styles.reviewPhoto} />
        </View>
      )}

      <View style={styles.reviewCard}>
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Basic Information</Text>
          <ReviewItem label="Name" value={formData.name} />
          <ReviewItem label="Species" value={formData.species} />
          <ReviewItem label="Breed" value={formData.breed} />
          <ReviewItem label="Date of Birth" value={formData.dateOfBirth.toLocaleDateString()} />
          <ReviewItem label="Sex" value={formData.sex} />
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Physical Details</Text>
          <ReviewItem label="Weight" value={`${formData.weight} lbs`} />
          <ReviewItem label="Color" value={formData.color} />
          {formData.markings && <ReviewItem label="Markings" value={formData.markings} />}
          {formData.microchipNumber && <ReviewItem label="Microchip" value={formData.microchipNumber} />}
          {formData.bloodType && <ReviewItem label="Blood Type" value={formData.bloodType} />}
        </View>
      </View>

      <View style={styles.submitInfoBox}>
        <Text style={styles.submitInfoText}>
          ✓ Your pet will be reviewed for blood donation eligibility
        </Text>
        <Text style={styles.submitInfoText}>
          ✓ You'll receive a notification once the review is complete
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
        <Text style={styles.title}>Add New Pet</Text>
        <View style={styles.progressContainer}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.progressItem}>
              <View
                style={[
                  styles.progressDot,
                  index <= currentStep && styles.progressDotActive,
                ]}
              />
              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.progressLine,
                    index < currentStep && styles.progressLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        <Text style={styles.stepIndicator}>
          Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={currentStep === 0 ? 'Cancel' : 'Back'}
          onPress={handleBack}
          variant="outline"
          style={styles.footerButton}
        />
        <Button
          title={currentStep === STEPS.length - 1 ? 'Submit' : 'Next'}
          onPress={handleNext}
          loading={isLoading}
          style={styles.footerButton}
        />
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewLabel}>{label}:</Text>
      <Text style={styles.reviewValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Sizes.spacing.lg,
    paddingTop: Sizes.spacing.xl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.spacing.sm,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gray300,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.gray300,
    marginHorizontal: Sizes.spacing.xs,
  },
  progressLineActive: {
    backgroundColor: Colors.primary,
  },
  stepIndicator: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Sizes.spacing.lg,
  },
  stepContent: {
    gap: Sizes.spacing.lg,
  },
  stepHeader: {
    marginBottom: Sizes.spacing.md,
  },
  stepDescription: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginTop: Sizes.spacing.xs,
    lineHeight: 22,
  },
  formSection: {
    gap: Sizes.spacing.md,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  infoText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  submitInfoBox: {
    backgroundColor: '#E8F5E9',
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    gap: Sizes.spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  submitInfoText: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: Sizes.borderRadius.lg,
    padding: Sizes.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewPhotoContainer: {
    alignItems: 'center',
    marginBottom: Sizes.spacing.md,
  },
  reviewPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  stepTitle: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  reviewSubtitle: {
    fontSize: Sizes.fontSize.md,
    color: Colors.textSecondary,
    marginBottom: Sizes.spacing.lg,
  },
  reviewSection: {
    marginBottom: Sizes.spacing.md,
  },
  reviewSectionTitle: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  reviewItem: {
    flexDirection: 'row',
    paddingVertical: Sizes.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  reviewLabel: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    width: 120,
  },
  reviewValue: {
    flex: 1,
    fontSize: Sizes.fontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    padding: Sizes.spacing.lg,
    gap: Sizes.spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerButton: {
    flex: 1,
  },
});
